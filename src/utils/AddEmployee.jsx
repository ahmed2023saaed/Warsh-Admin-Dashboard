import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { roleOptions } from '../Data/rolesPermissionsMockData';
import { createAdminUser } from '../api/addEmployee';
import { getPermissions } from '../api/authApi';

// Only used when GET /Admin/permissions fails
const fallbackPermissions = [
  { id: 1, label: 'Dashboard' },
  { id: 2, label: 'Customers' },
  { id: 3, label: 'Service Centers' },
  { id: 4, label: 'Bookings' },
  { id: 5, label: 'Payments' },
  { id: 6, label: 'Reviews' },
  { id: 7, label: 'Marketing' },
  { id: 8, label: 'Settings' },
  { id: 9, label: 'Admin Users' },
];

// 'all' = every permission the backend returns
const rolePermissions = {
  super_admin: 'all',

  admin: 'all',

  manager: [1, 2, 3, 4, 6, 7],

  finance: [1, 2, 4, 5, 6],

  operations: [1, 3, 4, 6],

  marketing: [1, 2, 6, 7],

  customer_support: [1, 2, 4, 6],
};

// The response shape isn't documented, so accept the common id/name variants
function normalizePermissions(data) {
  const list = Array.isArray(data) ? data : data?.permissions || data?.items || [];

  return list
    .map((item) => {
      const id = Number(item?.id ?? item?.permissionId);
      const label = item?.name ?? item?.permissionName ?? item?.displayName ?? item?.title;

      if (!Number.isInteger(id)) return null;

      return { id, label: label || `Permission ${id}` };
    })
    .filter(Boolean);
}

function AddEmployee({ onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      permissionIds: [],
    },
  });

  const nameValue = watch('name');
  const roleValue = watch('role');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [permissionOptions, setPermissionOptions] = useState([]);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [permissionsError, setPermissionsError] = useState('');
  const [permissionsRequest, setPermissionsRequest] = useState(0);

  // Load the permission list from the backend
  useEffect(() => {
    let ignore = false;

    async function loadPermissions() {
      setIsLoadingPermissions(true);
      setPermissionsError('');

      try {
        const data = await getPermissions();
        const permissions = normalizePermissions(data);

        console.log('PERMISSIONS:', data);

        if (permissions.length === 0) {
          throw new Error('The server returned no permissions');
        }

        if (!ignore) setPermissionOptions(permissions);
      } catch (error) {
        if (!ignore) {
          setPermissionOptions(fallbackPermissions);
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

  // Set default permissions based on selected role
  useEffect(() => {
    if (!roleValue) {
      setValue('permissionIds', []);
      return;
    }

    const preset = rolePermissions[roleValue] || [];
    const availableIds = permissionOptions.map((permission) => permission.id);

    setValue(
      'permissionIds',
      preset === 'all' ? availableIds : preset.filter((id) => availableIds.includes(id))
    );
  }, [roleValue, permissionOptions, setValue]);

  async function onSubmit(data) {
    try {
      setIsSubmitting(true);

      const permissionIds = (data.permissionIds || []).map(Number);

      if (permissionIds.length === 0) {
        throw new Error('Please select at least one page permission');
      }

      const adminData = {
        name: data.name,
        email: data.email,
        password: data.password,
        permissionIds,
      };

      console.log('Sending to backend:', adminData);

      const response = await createAdminUser(adminData, data.role);

      console.log('User created successfully:', response);

      toast.success(
        data.role === 'super_admin' ? 'Admin created successfully' : 'Employee created successfully'
      );

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create employee:', error);

      toast.error(error.message || 'Failed to create employee');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onError(errors) {
    console.log(errors);
  }

  function creatAccount(name) {
    if (!name?.trim()) {
      return {
        email: '',
        password: '',
      };
    }

    const cleanName = name.trim().toLowerCase();

    const firstName = cleanName.split(' ').at(0);
    const lastName = cleanName.split(' ').at(1);
    const capital = firstName.at(0).toUpperCase();

    const email = `${firstName}.${lastName}${Math.floor(Math.random() * 99) + 1}@warsha.com`;

    const password = `${capital}${firstName.slice(1)}@${Math.floor(Math.random() * 9000) + 1000}`;

    return {
      email,
      password,
    };
  }

  // Auto-generate credentials from name
  useEffect(() => {
    const account = creatAccount(nameValue);

    if (account.email) {
      setValue('email', account.email);
    }

    if (account.password) {
      setValue('password', account.password);
    }

    if (!nameValue) {
      setValue('email', '');
      setValue('password', '');
    }
  }, [nameValue, setValue]);

  const labelClass = 'block text-sm font-bold text-[#1C1712]';

  const errorClass = 'mt-1.5 text-xs font-medium text-[#D64545]';

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
      {/* Employee details */}
      <div className="rounded-xl border border-[#F0E1CC] bg-[#FFF9F1] px-4 py-3">
        <p className="text-sm font-bold text-[#1C1712]">Employee details</p>

        <p className="mt-1 text-xs leading-5 text-[#7A6F63]">
          Add a new employee. Email and password will be auto-generated from the name.
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
              required: 'Full name is required',
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

      {/* National ID */}
      <div>
        <label htmlFor="id" className={labelClass}>
          National ID <span className="text-[#D64545]">*</span>
        </label>

        <div className="mt-2">
          <Input
            type="number"
            placeholder="30302020501053"
            ID="id"
            maxLength={14}
            register={register('id', {
              required: 'National ID is required',
              validate: (v) => String(v).length === 14 || 'Please enter exactly 14 numbers',
            })}
            className="w-full"
            dimensions={{
              width: '100%',
              height: '44px',
            }}
          />

          {errors.id && <p className={errorClass}>{errors.id.message}</p>}

          <p className="mt-1 text-xs text-[#8A8074]">14 digits without spaces</p>
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone Number <span className="text-[#D64545]">*</span>
        </label>

        <div className="mt-2">
          <Input
            placeholder="0123456789"
            ID="phone"
            type="number"
            maxLength={11}
            register={register('phone', {
              required: 'Phone number is required',
              validate: (v) => String(v).length === 11 || 'Please enter exactly 11 numbers',
            })}
            className="w-full"
            dimensions={{
              width: '100%',
              height: '44px',
            }}
          />

          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className={labelClass}>
          Role <span className="text-[#D64545]">*</span>
        </label>

        <div className="mt-2">
          <select
            id="role"
            {...register('role', {
              required: 'Role is required',
            })}
            className="h-[44px] w-full rounded-[10px] border border-[#E8E2D8] bg-white px-3.5 text-sm text-[#1C1712] transition outline-none focus:border-[#E08B2F] focus:ring-[3px] focus:ring-[#E08B2F]/15"
            defaultValue=""
          >
            <option value="" disabled>
              Select a role
            </option>

            {roleOptions
              .filter((r) => r.key !== 'all')
              .map((role) => (
                <option key={role.key} value={role.key}>
                  {role.label}
                </option>
              ))}
          </select>

          {errors.role && <p className={errorClass}>{errors.role.message}</p>}

          <p className="mt-1 text-xs text-[#8A8074]">Super Admin has access to all pages</p>
        </div>
      </div>

      {/* Permissions */}
      <div>
        <label className={labelClass}>
          Page Permissions <span className="text-[#D64545]">*</span>
        </label>

        <p className="mt-1 text-xs text-[#8A8074]">
          Select the pages this employee is allowed to access.
        </p>

        {permissionsError && (
          <div className="mt-3 flex items-start justify-between gap-3 rounded-[10px] border border-[#F3C9C9] bg-[#FFF5F5] px-3 py-2.5">
            <p className="text-xs leading-5 text-[#B03A3A]">
              Couldn't load permissions from the server ({permissionsError}). Showing the default
              list.
            </p>

            <button
              type="button"
              onClick={() => setPermissionsRequest((count) => count + 1)}
              className="shrink-0 text-xs font-bold text-[#B03A3A] underline"
            >
              Retry
            </button>
          </div>
        )}

        {isLoadingPermissions ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2" aria-busy="true">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-[46px] animate-pulse rounded-[10px] border border-[#E8E2D8] bg-[#F7F3EE]"
              />
            ))}

            <p className="sr-only">Loading permissions...</p>
          </div>
        ) : (
          <Controller
            name="permissionIds"
            control={control}
            rules={{
              validate: (value) => value?.length > 0 || 'Please select at least one page',
            }}
            render={({ field }) => (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {permissionOptions.map((permission) => {
                  const checked = field.value?.includes(permission.id);

                  function handleChange() {
                    const currentPermissions = field.value || [];

                    if (checked) {
                      field.onChange(currentPermissions.filter((id) => id !== permission.id));
                    } else {
                      field.onChange([...currentPermissions, permission.id]);
                    }
                  }

                  return (
                    <label
                      key={permission.id}
                      className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-[#E8E2D8] bg-white px-3 py-3 transition hover:bg-[#FFFCF8]"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        className="h-4 w-4 accent-[#E08B2F]"
                      />

                      <span className="text-sm font-medium text-[#1C1712]">
                        {permission.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          />
        )}

        {errors.permissionIds && <p className={errorClass}>{errors.permissionIds.message}</p>}
      </div>

      {/* Account credentials */}
      <div className="border-t border-[#EEE8DF] pt-5">
        <p className="mb-4 text-sm font-bold text-[#1C1712]">Account credentials</p>

        <p className="mb-4 text-xs leading-5 text-[#8A8074]">
          Auto-filled from name, you can edit before creating.
        </p>

        <div className="grid gap-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-[#D64545]">*</span>
            </label>

            <div className="mt-2">
              <Input
                ID="email"
                placeholder="ahmed.mohamed23@warsha.com"
                register={register('email', {
                  required: 'Email is required',
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
                placeholder="••••••••"
                register={register('password', {
                  required: 'Password is required',
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
        disabled={isSubmitting}
        className="w-full !rounded-[10px] !border-[#1C1712] !bg-[#1C1712] !py-3 !text-sm !font-bold !text-white hover:!bg-[#2A211C]"
      >
        {isSubmitting ? 'Creating...' : 'Create Employee'}
      </Button>
    </form>
  );
}

export default AddEmployee;
