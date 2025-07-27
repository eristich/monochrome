import React from 'react';

type Props = React.ComponentPropsWithRef<"button"> & {
  children: React.ReactNode;
};

const UIButton = React.forwardRef<HTMLButtonElement, Props>(({ children, ...props }, ref) => {
  return (
    <button
      className={`
        w-full h-12 bg-black px-4 py-2 text-sm text-white border-2 border-black flex items-center justify-center gap-2
        rounded-sm
        shadow-sm
        transition-all duration-200
        focus:shadow-[0_0_0_3px_rgba(0,0,0,0.18),0_2px_8px_0_rgba(0,0,0,0.10)]
        outline-none
        cursor-pointer
        disabled:opacity-50
        disabled:cursor-not-allowed
      `}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default UIButton;
