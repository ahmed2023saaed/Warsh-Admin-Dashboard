import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Minus, Plus } from 'lucide-react';

import Button from '../components/UI/Button';
import DataTable from '../components/UI/DataTable';
import FilterButton from '../components/UI/FilterButton';
import Input from '../components/UI/Input';
import SettingsSection from '../components/UI/SettingsSection';
import State from '../components/UI/State';
import { showPromiseToast } from '../components/UI/toastNotifications';
import { adjustClientPoints, createLoyaltyReward } from '../api/loyaltyApi';

const labelClass = 'block text-sm font-bold text-[#1C1712]';
const errorClass = 'mt-1.5 text-xs font-medium text-[#D64545]';
const hintClass = 'mt-1 text-xs text-[#8A8074]';
const inputSize = { width: '100%', height: '44px' };
const primaryButtonClass =
  'w-full gap-2 !rounded-[10px] !border-[#E08B2F] !bg-[#E08B2F] !py-3 !text-sm !text-white hover:!border-[#C8730A] hover:!bg-[#C8730A]';
const deductButtonClass =
  'w-full gap-2 !rounded-[10px] !border-[#D64545] !bg-[#D64545] !py-3 !text-sm !text-white hover:!border-[#B93636] hover:!bg-[#B93636]';

// Empty inputs are sent to the backend as null.
const toNumberOrNull = (value) => (value === '' || value == null ? null : Number(value));

function wholeNumber(label, { optional = false } = {}) {
  return (value) => {
    if (value === null) return optional || `${label} is required`;
    return (Number.isInteger(value) && value > 0) || 'Enter a whole number above 0';
  };
}

function formatPoints(points) {
  return `${points > 0 ? '+' : ''}${points.toLocaleString('en-US')} WP`;
}

function formatTime(date) {
  return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(date);
}

function FormField({ id, label, required = false, error, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label} {required && <span className="text-[#D64545]">*</span>}
      </label>

      <div className="mt-2">{children}</div>

      {error ? <p className={errorClass}>{error.message}</p> : hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

function CreateRewardForm({ onCreated }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  async function onSubmit(data) {
    const reward = {
      name: data.name.trim(),
      description: data.description.trim() || null,
      pointsCost: data.pointsCost,
      discountAmount: data.discountAmount,
      expiryDays: data.expiryDays,
      redemptionLimitPerClient: data.redemptionLimitPerClient,
    };

    try {
      await showPromiseToast(() => createLoyaltyReward(reward), {
        loading: 'Creating reward...',
        success: `${reward.name} created successfully.`,
        error: (error) => error.message,
      });

      onCreated(reward);
      reset();
    } catch {
      // The toast already shows the error.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <FormField id="reward-name" label="Reward Name" required error={errors.name}>
        <Input
          ID="reward-name"
          placeholder="Free car wash"
          maxLength={100}
          register={register('name', {
            validate: (value) => Boolean(value.trim()) || 'Reward name is required',
          })}
          className="w-full"
          dimensions={inputSize}
        />
      </FormField>

      <FormField id="reward-description" label="Description" error={errors.description}>
        <textarea
          id="reward-description"
          rows={2}
          maxLength={300}
          placeholder="What the customer gets with this reward"
          {...register('description')}
          className="w-full resize-none rounded-[10px] border border-[#E8E2D8] bg-white px-3.5 py-2.5 text-[15.5px] text-[#1C1712] outline-none placeholder:text-[#8A8074] focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="reward-points" label="Points Cost" required error={errors.pointsCost}>
          <Input
            ID="reward-points"
            type="number"
            placeholder="500"
            register={register('pointsCost', {
              setValueAs: toNumberOrNull,
              validate: wholeNumber('Points cost'),
            })}
            className="w-full"
            dimensions={inputSize}
          />
        </FormField>

        <FormField
          id="reward-discount"
          label="Discount Amount (EGP)"
          error={errors.discountAmount}
          hint="Leave empty if it is not a discount"
        >
          <Input
            ID="reward-discount"
            type="number"
            placeholder="100"
            register={register('discountAmount', {
              setValueAs: toNumberOrNull,
              validate: (value) => value === null || value > 0 || 'Enter an amount above 0',
            })}
            className="w-full"
            dimensions={inputSize}
          />
        </FormField>

        <FormField
          id="reward-expiry"
          label="Voucher Expiry (days)"
          error={errors.expiryDays}
          hint="Leave empty for no expiry"
        >
          <Input
            ID="reward-expiry"
            type="number"
            placeholder="30"
            register={register('expiryDays', {
              setValueAs: toNumberOrNull,
              validate: wholeNumber('Expiry days', { optional: true }),
            })}
            className="w-full"
            dimensions={inputSize}
          />
        </FormField>

        <FormField
          id="reward-limit"
          label="Limit per Customer"
          error={errors.redemptionLimitPerClient}
          hint="Leave empty for no limit"
        >
          <Input
            ID="reward-limit"
            type="number"
            placeholder="1"
            register={register('redemptionLimitPerClient', {
              setValueAs: toNumberOrNull,
              validate: wholeNumber('Limit', { optional: true }),
            })}
            className="w-full"
            dimensions={inputSize}
          />
        </FormField>
      </div>

      <Button type="submit" disabled={isSubmitting} className={primaryButtonClass}>
        <Plus size={16} aria-hidden="true" />
        {isSubmitting ? 'Creating...' : 'Create Reward'}
      </Button>
    </form>
  );
}

function AdjustPointsForm({ onAdjusted }) {
  const [mode, setMode] = useState('add');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const isDeduct = mode === 'deduct';

  async function onSubmit(data) {
    const adjustment = {
      clientId: data.clientId,
      amount: isDeduct ? -data.points : data.points,
      reason: data.reason.trim(),
    };

    try {
      await showPromiseToast(() => adjustClientPoints(adjustment.clientId, adjustment), {
        loading: isDeduct ? 'Deducting points...' : 'Adding points...',
        success: `${formatPoints(adjustment.amount)} applied to client #${adjustment.clientId}.`,
        error: (error) => error.message,
      });

      onAdjusted(adjustment);
      reset();
    } catch {
      // The toast already shows the error.
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <FilterButton active={!isDeduct} onClick={() => setMode('add')} className="w-full !text-sm">
          <Plus size={16} aria-hidden="true" /> Add
        </FilterButton>
        <FilterButton active={isDeduct} onClick={() => setMode('deduct')} className="w-full !text-sm">
          <Minus size={16} aria-hidden="true" /> Deduct
        </FilterButton>
      </div>

      <FormField
        id="adjust-client"
        label="Client ID"
        required
        error={errors.clientId}
        hint="The customer's account ID"
      >
        <Input
          ID="adjust-client"
          type="number"
          placeholder="12"
          register={register('clientId', {
            setValueAs: toNumberOrNull,
            validate: wholeNumber('Client ID'),
          })}
          className="w-full"
          dimensions={inputSize}
        />
      </FormField>

      <FormField id="adjust-points" label="Points" required error={errors.points}>
        <Input
          ID="adjust-points"
          type="number"
          placeholder="50"
          register={register('points', {
            setValueAs: toNumberOrNull,
            validate: wholeNumber('Points'),
          })}
          className="w-full"
          dimensions={inputSize}
        />
      </FormField>

      <FormField
        id="adjust-reason"
        label="Reason"
        required
        error={errors.reason}
        hint="Saved with the adjustment for future reference"
      >
        <Input
          ID="adjust-reason"
          placeholder={isDeduct ? 'Points awarded by mistake' : 'Compensation for a delayed booking'}
          maxLength={200}
          register={register('reason', {
            validate: (value) => Boolean(value.trim()) || 'Reason is required',
          })}
          className="w-full"
          dimensions={inputSize}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
        className={isDeduct ? deductButtonClass : primaryButtonClass}
      >
        {isDeduct ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
        {isSubmitting ? 'Saving...' : isDeduct ? 'Deduct Points' : 'Add Points'}
      </Button>
    </form>
  );
}

const activityColumns = [
  {
    key: 'action',
    header: 'Action',
    render: (row) => {
      if (row.type === 'reward') return <State between>Reward created</State>;
      if (row.points > 0) return <State good>Points added</State>;
      return <State bad>Points deducted</State>;
    },
  },
  {
    key: 'details',
    header: 'Details',
    render: (row) => (
      <div>
        <p className="text-sm font-bold text-[#1C1712]">{row.title}</p>
        <p className="mt-0.5 text-xs text-[#8A8074]">{row.subtitle}</p>
      </div>
    ),
  },
  {
    key: 'points',
    header: 'Points',
    render: (row) => (
      <span
        className={`text-sm font-extrabold ${
          row.type === 'reward' ? 'text-[#1C1712]' : row.points > 0 ? 'text-[#1F9D55]' : 'text-[#D64545]'
        }`}
      >
        {row.type === 'reward' ? `${row.points.toLocaleString('en-US')} WP` : formatPoints(row.points)}
      </span>
    ),
  },
  {
    key: 'time',
    header: 'Time',
    render: (row) => <span className="text-sm text-[#5F554C]">{formatTime(row.createdAt)}</span>,
  },
];

export default function Loyalty() {
  const [activity, setActivity] = useState([]);

  function addActivity(entry) {
    const createdAt = new Date();

    setActivity((current) => [
      { ...entry, id: `${entry.type}-${createdAt.getTime()}`, createdAt },
      ...current,
    ]);
  }

  return (
    <div className="min-w-0 space-y-6">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 xl:items-start">
        <SettingsSection title="Create Reward">
          <p className="mt-3 text-sm text-[#8A8074]">
            Add a reward customers can redeem with their Warsha Points.
          </p>

          <CreateRewardForm
            onCreated={(reward) =>
              addActivity({
                type: 'reward',
                title: reward.name,
                subtitle: reward.discountAmount
                  ? `${reward.discountAmount.toLocaleString('en-US')} EGP discount`
                  : reward.description || 'New reward',
                points: reward.pointsCost,
              })
            }
          />
        </SettingsSection>

        <SettingsSection title="Adjust Customer Points">
          <p className="mt-3 text-sm text-[#8A8074]">
            Manually add or deduct points from a customer&apos;s wallet.
          </p>

          <AdjustPointsForm
            onAdjusted={(adjustment) =>
              addActivity({
                type: 'adjustment',
                title: `Client #${adjustment.clientId}`,
                subtitle: adjustment.reason,
                points: adjustment.amount,
              })
            }
          />
        </SettingsSection>
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-bold text-[#17120E]">Recent Changes</h2>
          <span className="text-xs text-[#8A8074]">Shown for this session only</span>
        </div>

        <DataTable
          columns={activityColumns}
          data={activity}
          emptyMessage="Rewards and point adjustments you make will appear here."
          minWidth="640px"
        />
      </section>
    </div>
  );
}
