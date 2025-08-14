import { Icon } from "@iconify/react";
import { type MusicType } from "@/lib/schema/music";
import { useRemoveMusic } from "@/lib/api/hooks/use-music";

type UIMusicItemProps = React.ComponentPropsWithRef<'div'> & {
  music: MusicType;
}

const UIMusicItem: React.FC<UIMusicItemProps> = ({ music, ...props }) => {
  const remove = useRemoveMusic();

  const handleDelete = (musicId: string) => {
    remove.mutate({ musicId });
  }

  return (
    <div
      className="flex flex-row items-center justify-between border-[#000000] border-b-1 p-2.5 gap-2.5 cursor-pointer h-16.5 hover:bg-gray-100"
      {...props}
    >
      <div className="flex flex-row items-center gap-4">
        <img src="/app/music-cover.png" alt={music.name} className="w-12 h-12 rounded-md object-cover aspect-square" />
        <div className="flex-1 flex flex-col min-w-0">
          <div className="relative w-40 overflow-hidden">
            <span
              aria-label={`Titre de la musique: ${music.name}`}
              className="font-semibold text-sm text-black whitespace-nowrap block animate-marquee min-w-full"
            >
              {music.name}&nbsp;&nbsp;&nbsp;&nbsp;{music.name}
            </span>
          </div>
          <span
            aria-label={`Artiste de la musique: ${music.artist}`}
            className="font-medium text-[#868686] text-sm italic"
          >
            {music.artist}
          </span>
        </div>
      </div>
      <div className="flex-1 text-right">
        {/* TODO: afficher la vraie durée si dispo */}
        <span
          aria-label="Durée de la musique"
          className="text-xs font-semibold text-black italic leading-4"
        >
          -- MIN
        </span>
      </div>
      <button
        aria-label="Supprimer la musique"
        data-testid={`music-item-delete-button-${music.id}`}
        onClick={() => handleDelete(music.id)}
        className="ml-2 p-2 rounded-full hover:bg-gray-100 text-black hover:text-red-600 transition cursor-pointer"
        title="Supprimer"
      >
        <Icon icon="mdi:delete-outline" width={22} height={22} />
      </button>
    </div>
  )
}

export default UIMusicItem;
