import { useForm } from 'react-hook-form';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { roleOptions } from '../Data/rolesPermissionsMockData';

function AddEmployee({ onSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();
  const nameValue = watch('name');

  function onSubmit(data) {
    const account = creatAccount(data.name);
    console.log({ ...data, ...account });
    reset();
    onSuccess?.();
  }

  function onError(errors) {
    console.log(errors);
  }

  function creatAccount(name) {
    if (!name?.trim()) return { email: '', password: '' };
    const cleanName = name.trim().toLowerCase();
    const firstName = cleanName.split(' ').at(0);
    const capital = firstName.at(0).toUpperCase();

    const email = `${cleanName.split(' ').join('.')}${Math.floor(Math.random() * 99) + 1}@warsha.com`;
    const password = `${capital}${firstName.slice(1)}@${Math.floor(Math.random() * 9000) + 1000}`;
    return { email, password };
  }

  const account = creatAccount(nameValue);

  const labelClass = 'block text-sm font-bold text-[#1C1712]';
  const errorClass = 'mt-1.5 text-xs font-medium text-[#D64545]';

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-5">
      <div className="rounded-xl border border-[#F0E1CC] bg-[#FFF9F1] px-4 py-3">
        <p className="text-sm font-bold text-[#1C1712]">Employee details</p>
        <p className="mt-1 text-xs leading-5 text-[#7A6F63]">
          Add a new employee. Email and password will be auto-generated from the name.
        </p>
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>
          Full Name <span className="text-[#D64545]">*</span>
        </label>
        <div className="mt-2">
          <Input
            placeholder="Ahmed Mohamed"
            ID="name"
            register={register('name', { required: 'Full name is required' })}
            className="w-full"
            dimensions={{ width: '100%', height: '44px' }}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
      </div>

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
            dimensions={{ width: '100%', height: '44px' }}
          />
          {errors.id && <p className={errorClass}>{errors.id.message}</p>}
          <p className="mt-1 text-xs text-[#8A8074]">14 digits without spaces</p>
        </div>
      </div>

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
            dimensions={{ width: '100%', height: '44px' }}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="role" className={labelClass}>
          Role <span className="text-[#D64545]">*</span>
        </label>
        <div className="mt-2">
          <select
            id="role"
            {...register('role', { required: 'Role is required' })}
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

      <div className="border-t border-[#EEE8DF] pt-5">
        <p className="mb-4 text-sm font-bold text-[#1C1712]">Auto-generated account</p>
        <div className="grid gap-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <div className="mt-2">
              <Input
                ID="email"
                value={account.email}
                placeholder="Will be generated from name"
                className="w-full !bg-[#F8F5F3]"
                dimensions={{ width: '100%', height: '44px' }}
              />
              <p className="mt-1 text-xs text-[#8A8074]">e.g. ahmed.mohamed23@warsha.com</p>
            </div>
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <div className="mt-2">
              <Input
                ID="password"
                value={account.password}
                placeholder="Will be generated from name"
                className="w-full !bg-[#F8F5F3]"
                dimensions={{ width: '100%', height: '44px' }}
              />
            </div>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full !rounded-[10px] !border-[#1C1712] !bg-[#1C1712] !py-3 !text-sm !font-bold !text-white hover:!bg-[#2A211C]"
      >
        Create Employee
      </Button>
    </form>
  );
}

export default AddEmployee;
