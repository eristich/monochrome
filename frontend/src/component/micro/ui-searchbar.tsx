import { forwardRef } from "react";
import { cn } from "@/lib/util/utils";

type Props = React.ComponentPropsWithRef<'input'> & {
  icon?: React.ReactElement;
}

const UISearchbar: React.FC<Props> = forwardRef(({ icon, className, ...props }, ref) => {
  return (
    <div className="flex items-center border-black border-2 rounded-sm px-3 h-12 bg-white mb-3
      focus-within:border-black
        focus-within:shadow-[0_0_0_3px_rgba(0,0,0,0.18),0_2px_8px_0_rgba(0,0,0,0.10)]
        focus-within:bg-gray-50 transition-all duration-200 shadow-sm"
      >
        { icon && icon }
        <input
          type="text"
          className={cn(
            "flex-1 bg-transparent outline-none text-sm italic font-medium h-11",
            className
          )}
          {...props}
          ref={ref}
        />
      </div>
    )
  }
)

export default UISearchbar;
