import React from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

type Props = {
  title: string;
}

const UINavigationBack: React.FC<Props> = ({ title }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-12 rounded-sm border-3 border-black flex justify-between items-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200"
      onClick={() => navigate(-1)}
    >
      <div className="w-12 h-12 bg-black flex items-center justify-center">
        <Icon icon="mdi:arrow-left-thin" width={48} height={48} color="white" />
      </div>
      <h4 className="text-sm font-bold underline text-black pr-3">
        {title}
      </h4>
    </div>
  )
}

export default UINavigationBack;
