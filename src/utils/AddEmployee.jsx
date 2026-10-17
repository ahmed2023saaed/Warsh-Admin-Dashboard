import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Check } from 'lucide-react';

import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { createAdminUser } from '../api/addEmployee';
import { getPermissions } from '../api/authApi';

// Each type maps to its own endpoint: /Admin/create-employee or /Admin/create-admin
const accountTypes = [
  { value: 'employee', label: 'Employee' },
  { value: 'admin', label: 'Admin' },
];

const defaultValues = {
  name: '',
  accountType: 'employee',
  permissionIds: [],
  email: '',
  password: '',
};

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Some keyboards add invisible direction marks (like U+200F) when switching between
// Arabic and English. The backend rejects them, so strip them before validating and sending.
const removeInvisible = (value) =>
  String(value ?? '')
    .replace(/[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g, '')
    .trim();

// Build an email and password from the name, e.g. "Ahmed Mohamed" ->
// ahmed.mohamed42@warsha.com / Ahmed@4821
function createAccount(name) {
  const words = name?.trim().toLowerCase().split(/\s+/).filter(Boolean) || [];

  if (words.length === 0) {
    return { email: '', password: '' };
  }

  // Arabic names have no Latin letters, so fall back to generic words
  const latinWords = words.map((word) => word.replace(/[^a-z0-9]/g, '')).filter(Boolean);
  const emailName = latinWords.slice(0, 2).join('.') || 'employee';

  const firstName = words[0].replace(/[^a-z]/g, '');
  const passwordName = firstName.length >= 3 ? firstName : 'warsha';

  return {
    email: `${emailName}${randomNumber(1, 99)}@warsha.com`,
    password: `${passwordName[0].toUpperCase()}${passwordName.slice(1)}@${randomNumber(1000, 9999)}`,
  };
}

function AddEmployee({ onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({ defaultValues });

  const nameValue = watch('name');
  const accountType = watch('accountType');
  const selectedIds = watch('permissionIds');

  const [permissionOptions, setPermissionOptions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionsRequest, setPermissionsRequest] = useState(0);

  const allPermissionIds = permissionOptions.map((permission) => permission.id);

  // Show permissions under their module, e.g. Bookings: View Bookings, Manage Bookings
  const permissionGroups = [];

  for (const permission of permissionOptions) {
    const group = permissionGroups.find(([module]) => module === permission.module);

    if (group) group[1].push(permission);
    else permissionGroups.push([permission.module, [permission]]);
  }
  const allSelected =
    allPermissionIds.length > 0 && allPermissionIds.every((id) => selectedIds.includes(id));

  // Load the permission list from GET /Admin/permissions
  useEffect(() => {
    let ignore = false;

    async function loadPermissions() {
      setIsLoadingPermissions(true);
      setPermissionsError('');

      try {
        const permissions = await getPermissions();

        if (permissions.length === 0) {
          throw new Error('The server returned no permissions');
        }

        if (!ignore) setPermissionOptions(permissions);
      } catch (error) {
        if (!ignore) {
          setPermissionOptions([]);
          setPermissionsError(error.message || 'Failed to load permissions');
        }
      } finally {
        if (!ignore) setIsLoadingPermissions(false);
      }
    }

    loadPermissions();

    return () => {
      ignore = true;
    };
  }, [permissionsRequest]);

  // Auto-generate credentials from name
  useEffect(() => {
    const account = createAccount(nameValue);

    setValue('email', account.email);
    setValue('password', account.password);
  }, [nameValue, setValue]);

  function setPermissions(ids) {
    setValue('permissionIds', ids, { shouldValidate: isSubmitted });
  }

  // Admins start with every permission, employees start with none
  function handleAccountTypeChange(event) {
    setPermissions(event.target.value === 'admin' ? allPermissionIds : []);
  }

  async function onSubmit(data) {
    const adminData = {
      name: data.name,
      email: data.email,
      password: data.password,
      permissionIds: data.permissionIds,
    };

    try {
      await createAdminUser(adminData, data.accountType);

      toast.success(
        data.accountType === 'admin'
          ? 'Admin created successfully'
          : 'Employee created successfully'
      );

      reset();
      onSuccess?.();
    } catch (error) {
      const fieldErrors = error.fieldErrors || {};

      for (const field of ['name', 'email', 'password']) {
        if (fieldErrors[field]) {
          setError(field, { type: 'server', message: fieldErrors[field] });
        }
      }

      if (fieldErrors.permissionids) {
        setError('permissionIds', { type: 'server', message: fieldErrors.permissionids });
      }

      toast.error(error.message || 'Failed to create employee');
    }
  }

  const labelClass = 'block text-sm font-bold text-[#1C1712]';

  const errorClass = 'mt-1.5 text-xs font-medium text-[#D64545]';

  const hintClass = 'mt-1 text-xs text-[#8A8074]';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Employee details */}
      <div className="rounded-xl border border-[#F0E1CC] bg-[#FFF9F1] px-4 py-3">
        <p className="text-sm font-bold text-[#1C1712]">Employee details</p>

        <p className="mt-1 text-xs leading-5 text-[#7A6F63]">
          Add a new employee and choose what they can access. Email and password are auto-generated
          from the name.
        </p>
      </div>

      {/* Name */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Full Name <span className="text-[#D64545]">*</span>
        </label>

        <div className="mt-2">
          <Input
            placeholder="Ahmed Mohamed"
            ID="name"
            register={register('name', {
              setValueAs: removeInvisible,
              required: 'Full name is required',
              validate: (v) => v.trim().length >= 3 || 'Please enter at least 3 letters',
            })}
            className="w-full"
            dimensions={{
              width: '100%',
              height: '44px',
            }}
          />

          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
      </div>

      {/* Account type */}
      <div>
        <p id="account-type-label" className={labelClass}>
          Account Type <span className="text-[#D64545]">*</span>
        </p>

        <div
          role="radiogroup"
          aria-labelledby="account-type-label"
          className="mt-2 grid grid-cols-2 gap-1 rounded-[12px] bg-[#F4EFE8] p-1"
        >
          {accountTypes.map((type) => (
            <label
              key={type.value}
              className={`cursor-pointer rounded-[10px] px-3 py-2.5 text-center text-sm font-bold transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E08B2F]/40 ${
                accountType === type.value
                  ? 'bg-white text-[#1C1712] shadow-[0_1px_3px_rgba(28,23,18,0.12)]'
                  : 'text-[#7A6F63] hover:text-[#1C1712]'
              }`}
            >
              <input
                type="radio"
                value={type.value}
                className="sr-only"
                {...register('accountType', { onChange: handleAccountTypeChange })}
              />
              {type.label}
            </label>
          ))}
        </div>

        <p className={hintClass}>
          {accountType === 'admin'
            ? 'Admins start with every permission selected. You can still remove some below.'
            : 'Employees only get the permissions you select below.'}
        </p>
      </div>

      {/* Permissions */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
          <div>
            <p id="permissions-label" className={labelClass}>
              Permissions <span className="text-[#D64545]">*</span>
            </p>

            <p className={hintClass}>Choose what this account can view and manage.</p>
          </div>

          {permissionOptions.length > 0 && (
            <div className="flex items-center gap-3 text-xs">
              <span className="text-[#8A8074]">
                {selectedIds.length} of {permissionOptions.length} selected
              </span>

              <button
                type="button"
                onClick={() => setPermissions(allSelected ? [] : allPermissionIds)}
                className="cursor-pointer font-bold text-[#C2701E] hover:underline"
              >
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
          )}
        </div>

        {isLoadingPermissions ? (
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-[48px] animate-pulse rounded-[10px] border border-[#E8E2D8] bg-[#F7F3EE]"
              />
            ))}

            <p className="sr-only">Loading permissions...</p>
          </div>
        ) : permissionsError ? (
          <div className="mt-3 flex items-start justify-between gap-3 rounded-[10px] border border-[#F3C9C9] bg-[#FFF5F5] px-3 py-2.5">
            <p className="text-xs leading-5 text-[#B03A3A]">
              Couldn't load permissions from the server ({permissionsError}). You need them to
              create an account.
            </p>

            <button
              type="button"
              onClick={() => setPermissionsRequest((count) => count + 1)}
              className="shrink-0 cursor-pointer text-xs font-bold text-[#B03A3A] underline"
            >
              Retry
            </button>
          </div>
        ) : (
          <Controller
            name="permissionIds"
            control={control}
            rules={{
              validate: (value) => value?.length > 0 || 'Please select at least one permission',
            }}
            render={({ field }) => (
              <div role="group" aria-labelledby="permissions-label" className="mt-3 space-y-4">
                {permissionGroups.map(([module, permissions]) => (
                  <fieldset key={module || 'other'}>
                    {module && (
                      <legend className="mb-2 text-xs font-bold tracking-wide text-[#8A8074] uppercase">
                        {module}
                      </legend>
                    )}

                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {permissions.map((permission) => {
                        const checked = field.value.includes(permission.id);

                        function handleChange() {
                          field.onChange(
                            checked
                              ? field.value.filter((id) => id !== permission.id)
                              : [...field.value, permission.id]
                          );
                        }

                        return (
                          <label
                            key={permission.id}
                            className={`flex min-h-[48px] cursor-pointer items-center gap-3 rounded-[10px] border px-3 py-2.5 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#E08B2F]/40 ${
                              checked
                                ? 'border-[#E08B2F] bg-[#FFF9F1]'
                                : 'border-[#E8E2D8] bg-white hover:bg-[#FFFCF8]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={handleChange}
                              className="sr-only"
                            />

                            <span
                              aria-hidden="true"
                              className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition ${
                                checked
                                  ? 'border-[#E08B2F] bg-[#E08B2F]'
                                  : 'border-[#CFC6BA] bg-white'
                              }`}
                            >
                              {checked && (
                                <Check size={12} strokeWidth={3} className="text-white" />
                              )}
                            </span>

                            <span className="text-sm font-medium text-[#1C1712]">
                              {permission.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
          />
        )}

        {errors.permissionIds && <p className={errorClass}>{errors.permissionIds.message}</p>}
      </div>

      {/* Account credentials */}
      <div className="border-t border-[#EEE8DF] pt-5">
        <p className="text-sm font-bold text-[#1C1712]">Account credentials</p>

        <p className="mt-1 mb-4 text-xs leading-5 text-[#8A8074]">
          Auto-filled from the name. You can edit them before creating, and share them with the
          employee afterwards.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-[#D64545]">*</span>
            </label>

            <div className="mt-2">
              <Input
                ID="email"
                type="email"
                placeholder="ahmed.mohamed23@warsha.com"
                register={register('email', {
                  setValueAs: removeInvisible,
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email',
                  },
                })}
                className="w-full"
                dimensions={{
                  width: '100%',
                  height: '44px',
                }}
              />

              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className={labelClass}>
              Password <span className="text-[#D64545]">*</span>
            </label>

            <div className="mt-2">
              <Input
                ID="password"
                placeholder="Ahmed@4821"
                register={register('password', {
                  setValueAs: removeInvisible,
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full"
                dimensions={{
                  width: '100%',
                  height: '44px',
                }}
              />

              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isSubmitting || isLoadingPermissions || permissionOptions.length === 0}
        className="w-full !rounded-[10px] !border-[#1C1712] !bg-[#1C1712] !py-3 !text-sm !font-bold !text-white hover:!bg-[#2A211C]"
      >
        {isSubmitting
          ? 'Creating...'
          : accountType === 'admin'
            ? 'Create Admin'
            : 'Create Employee'}
      </Button>
    </form>
  );
}

export default AddEmployee;
