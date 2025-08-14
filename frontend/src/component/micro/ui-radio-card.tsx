import { useState } from "react";

export default function UIRadioCard() {

  const title = "Titre de la musique";
  const artist = "Nom de l'artiste";

  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <div
      className="flex justify-between items-center bg-white h-24 py-2.5 px-3 w-full max-w-md rounded-sm shadow-xl"
      style={{
        background: "conic-gradient(from 141deg at 54.63% 57.06%, #FAFAFA 0deg, #949494 360deg)",
      }}
    >
      <img
        src="/app/music-cover.png"
        alt="Cover"
        className="rounded-md object-cover aspect-square h-full"
      />
      <div className="flex flex-col h-full justify-between items-end gap-1">
        <div className="flex flex-col items-end">
          <span className="font-semibold text-base text-gray-900 leading-4">{title}</span>
          <span className="text-sm text-gray-600 leading-4">{artist}</span>
        </div>
        <button
          onClick={handlePlayPause}
          className="mr-3 w-10 h-10 flex items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition cursor-pointer"
          aria-label={isPlaying ? "Mettre en pause" : "Lire"}
        >
          {isPlaying ? (
            // Icône pause
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            // Icône play
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <polygon points="6,4 20,12 6,20" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
