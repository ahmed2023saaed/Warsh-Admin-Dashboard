import { useEffect, useState } from 'react';
import Button from './Button';
import Modal from './Modal';

function useForm(initialValues = {}) {
  const [values, setValues] = useState(initialValues);

  function setField(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function reset() {
    setValues(initialValues);
  }

  return {
    values,
    setField,
    handleChange,
    reset,
  };
}

function SuspendModal({
  open,
  onClose,
  isSuspended = false,
  itemName = 'this item',
  onConfirm,
  children,
  confirmLabel,
  title,
  showDurationOptions = false,
  durationLabel = 'Choose how long this service center should be suspended.',
}) {
  const form = useForm({
    reason: '',
    duration: '1',
    customDuration: '',
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, itemName]);

  const actionLabel = confirmLabel ?? (isSuspended ? 'Activate' : 'Suspend');
  const modalTitle = title ?? (isSuspended ? `Activate ${itemName}` : `Suspend ${itemName}`);
  const isActionDisabled = !isSuspended && !form.values.reason.trim();

  function getSelectedDurationDays() {
    if (!showDurationOptions) return null;

    if (form.values.duration === 'custom') {
      return Number(form.values.customDuration);
    }

    return Number(form.values.duration);
  }

  function handleConfirm() {
    if (isActionDisabled) return;

    const payload = isSuspended
      ? { action: 'activate' }
      : {
          action: 'suspend',
          reason: form.values.reason.trim(),
          ...(showDurationOptions ? { durationDays: getSelectedDurationDays() } : {}),
        };

    onConfirm?.(payload);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      size="md"
      footer={
        <>
          <Button onClick={onClose} className="min-w-24 !px-5 !py-2.5 !text-sm">
            Cancel
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isActionDisabled}
            className={
              isSuspended
                ? 'min-w-28 !border-[#20A45B] !bg-[#20A45B] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#19894A] hover:!bg-[#19894A] disabled:!cursor-not-allowed disabled:!opacity-50'
                : 'min-w-28 !border-[#D64545] !bg-[#D64545] !px-5 !py-2.5 !text-sm !text-white hover:!border-[#B93636] hover:!bg-[#B93636] disabled:!cursor-not-allowed disabled:!opacity-50'
            }
          >
            {actionLabel}
          </Button>
        </>
      }
    >
      {isSuspended ? (
        <p className="text-sm leading-6 text-[#6F665C]">
          Activate {itemName} and allow it to receive customer bookings again?
        </p>
      ) : (
        <div className="space-y-4">
          {children}

          {showDurationOptions && (
            <div className="space-y-4">
              <p className="text-sm leading-6 text-[#8A8074]">{durationLabel}</p>

              <div className="grid gap-2 sm:grid-cols-3">
                {['1', '3', '7'].map((days) => (
                  <label
                    key={days}
                    className="flex cursor-pointer items-center gap-2 rounded-[10px] border border-[#E4DDD3] px-3 py-2.5 text-sm font-medium text-[#1C1712] has-[:checked]:border-[#D64545] has-[:checked]:bg-[#FFF7F7]"
                  >
                    <input
                      type="radio"
                      name="suspension-duration"
                      value={days}
                      checked={form.values.duration === days}
                      onChange={(event) => form.setField('duration', event.target.value)}
                      className="accent-[#D64545]"
                    />
                    {days} day{days === '1' ? '' : 's'}
                  </label>
                ))}
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#1C1712]">
                <input
                  type="radio"
                  name="suspension-duration"
                  value="custom"
                  checked={form.values.duration === 'custom'}
                  onChange={(event) => form.setField('duration', event.target.value)}
                  className="accent-[#D64545]"
                />
                Custom duration
              </label>

              {form.values.duration === 'custom' && (
                <input
                  type="number"
                  min="1"
                  value={form.values.customDuration}
                  onChange={(event) => form.setField('customDuration', event.target.value)}
                  placeholder="Enter number of days"
                  className="w-full rounded-[10px] border border-[#E8E2D8] bg-white px-3 py-2.5 text-sm text-[#1C1712] transition outline-none focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
                />
              )}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="suspension-reason"
              className="block text-sm font-semibold text-[#1C1712]"
            >
              Reason for suspension
            </label>

            <textarea
              id="suspension-reason"
              name="reason"
              rows={4}
              value={form.values.reason}
              onChange={form.handleChange}
              placeholder="Enter the reason for suspending this item"
              className="w-full resize-none rounded-[10px] border border-[#E8E2D8] bg-white px-3 py-2.5 text-sm text-[#1C1712] transition outline-none focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
              required
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

export default SuspendModal;
