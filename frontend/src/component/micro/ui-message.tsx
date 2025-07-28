import React from "react";

interface UIMessageProps {
  username: string;
  date: string; // Format lisible, ex: "il y a 2 minutes" ou "12:30"
  message: string;
  isCurrentUser?: boolean; // Ajout d'une prop pour savoir si c'est l'utilisateur actuel
}

const UIMessage: React.FC<UIMessageProps> = ({ username, date, message, isCurrentUser = false }) => {
  // Détermine la couleur de fond selon l'utilisateur
  const bubbleBg = isCurrentUser ? "#353B4A" : "#ECECEC";
  const textColor = isCurrentUser ? "text-white" : "text-gray-900";

  return (
    <div className="ml-10 flex flex-col items-start mb-4">
      <div className="flex items-baseline mb-1">
        <span className="text-xs font-semibold text-gray-700 mr-2">{username}</span>
        <span className="text-[10px] text-gray-400">{date}</span>
      </div>
      <div
        className={`flex items-center  rounded-sm p-2 min-h-[38px] ${textColor}`}
        style={{ background: bubbleBg }}
      >
        <span className="text-[13px] font-[400] text-left">{message}</span>
      </div>
    </div>
  );
};

export default UIMessage;
