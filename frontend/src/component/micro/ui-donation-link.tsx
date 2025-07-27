import React from 'react'
import { cn } from '@/lib/util/utils';

type Props = React.ComponentPropsWithoutRef<'a'>;

const UIDonationLink: React.FC<Props> = ({ className, ...props }) => {
  return (
    <a
      className={
        cn("flex items-center justify-center bg-yellow rounded-sm px-4 py-2 w-full cursor-pointer hover:bg-[#f3c364] hover:scale-101 transition-all duration-200",
        className
      )}
      href="#"
      target="_blank"
      {...props}
    >
      <h1 className="font-bold text-lg text-black italic underline">Soutenir ?</h1>
    </a>
  )
}

export default UIDonationLink;
