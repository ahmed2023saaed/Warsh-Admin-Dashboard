// components/ui/FilterSelect.jsx

import { ChevronDown } from 'lucide-react';

export default function FilterSelect({
  value,
  onChange,
  options,
  ariaLabel,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={ariaLabel}
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#DED2C6] bg-white py-2 pr-9 pl-3 text-sm text-[#17120E] outline-none transition-colors hover:border-[#C6B6A7] focus:border-[#E4790B] focus:ring-2 focus:ring-[#E4790B]/10"
      >
        {options.map((option) => (
          <option
            key={option.key}
            value={option.key}
          >
            {option.label}
          </option>
        ))}
      </select>

      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6B625C]"
        aria-hidden="true"
      />
    </div>
  );
}