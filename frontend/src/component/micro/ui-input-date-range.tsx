import React from "react";
import DatePicker from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("fr", fr);

type Props = {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  value?: { startDate: Date | null; endDate: Date | null };
  onChange?: (value: { startDate: Date | null; endDate: Date | null }) => void;
  className?: string;
  name?: string;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
};

const UIInputDateRange = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      icon,
      label,
      error,
      className = '',
      value = { startDate: null, endDate: null },
      onChange,
      name,
      placeholder,
      minDate,
      maxDate,
      disabled,
      ...inputProps
    },
    ref
  ) => {
    const handleChange = (dates: [Date | null, Date | null]) => {
      onChange?.({ startDate: dates[0], endDate: dates[1] });
    };

    return (
      <div>
        {label && (
          <label
            className="text-sm font-normal text-black mb-1 block"
            htmlFor={name}
          >
            {label}
          </label>
        )}
        <div
          className={`flex items-center border-2 border-black rounded-sm px-3 py-2 bg-white transition-all duration-200 min-h-[48px] max-h-[48px] shadow-sm focus-within:border-black focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.18),0_2px_8px_0_rgba(0,0,0,0.10)] focus-within:bg-gray-50 ${className}`}
        >
          <DatePicker
            selectsRange
            startDate={value.startDate}
            endDate={value.endDate}
            selected={value.startDate}
            onChange={handleChange}
            dateFormat="dd/MM/yyyy"
            locale="fr"
            wrapperClassName="w-full"
            className="w-full bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm font-normal border-none focus:ring-0"
            placeholderText={placeholder}
            minDate={minDate}
            maxDate={maxDate}
            name={name}
            disabled={disabled}
            // @ts-expect-error: DatePicker n'accepte pas le ref HTMLInputElement, mais il n'est pas nécessaire ici
            ref={ref}
            {...inputProps}
          />
          {icon && (
            <span className="ml-2 flex items-center text-gray-400 cursor-pointer select-none">
              {icon}
            </span>
          )}
        </div>
        {error && <p className="text-red text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

export default UIInputDateRange;
