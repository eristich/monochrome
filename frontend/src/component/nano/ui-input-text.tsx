import React from "react";

type Props = React.ComponentPropsWithRef<'input'> & {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
};

const UIInputText = React.forwardRef<HTMLInputElement, Props>(
  ({ icon, label, error, className = '', ...inputProps }, ref) => {
    return (
      <div>
        {label && <label
          className="text-sm font-normal text-black mb-1 block"
          htmlFor={inputProps.name}
        >{label}</label>}
        <div
          className={`flex items-center border-2 border-black rounded-sm px-3 py-2 bg-white transition-all duration-200 min-h-[48px] shadow-sm
            focus-within:border-black
            focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.18),0_2px_8px_0_rgba(0,0,0,0.10)]
            focus-within:bg-gray-50
            ${className}`}
        >
          <input
            ref={ref}
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400 text-sm font-normal"
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

export default UIInputText;
