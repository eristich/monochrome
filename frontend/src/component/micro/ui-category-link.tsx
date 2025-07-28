import { Link, type LinkProps } from "react-router-dom";
import React from "react";
import { cn } from "@/lib/util/utils";

type Props = LinkProps;

/**
 * Composant wrapper pour le composant Link de react-router-dom.
 * Permet d'uniformiser l'utilisation des liens dans l'application.
 */
const UICategoryLink: React.FC<Props> = ({ className, ...props }) => {
  return (
    <Link
      className={cn(
        "w-full flex h-12 p-2.5 border border-b-black border-t-0 border-l-0 border-r-0 justify-between items-center hover:bg-gray-100 text-sm font-normal",
        className
      )}
      {...props}
    >
      {props.children}
    </Link>
  );
};

export default UICategoryLink;
