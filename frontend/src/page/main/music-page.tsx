import React, { useState, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useMusicList, useUploadMusic } from '@/lib/api/hooks/use-music';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import UIMusicItem from '@/component/micro/ui-music-item';
import UIDonationLink from '@/component/micro/ui-donation-link';
import UISearchbar from '@/component/micro/ui-searchbar';
import {
  UploadMusicRequestSchema,
  type UploadMusicRequestType
}
from '@/lib/schema/music';
import { toast } from 'sonner';

const MusicPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // react-hook-form
  const {
    handleSubmit,
    setValue,
  } = useForm<UploadMusicRequestType>({
    resolver: zodResolver(UploadMusicRequestSchema),
    mode: 'onChange',
  });

  // Récupération des musiques via React Query
  const { data: musicList, isLoading } = useMusicList({});
  const upload = useUploadMusic();

  // Filtrage local
  const filtered = musicList?.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    (m.artist?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('file', file);
      handleSubmit(onSubmit)();
    }
  };

  const onSubmit = (data: UploadMusicRequestType) => {
    upload.mutate(data, {
      onError: () => toast.error('Erreur lors du téléversement de la musique'),
    });
  };

  return (
    <div
      className="w-full max-w-md mx-auto flex flex-col gap-2"
      style={{
        height: 'calc(100dvh - 84px - 24px)',
        maxHeight: 'calc(100dvh - 84px - 24px)',
      }}
    >
      {/* Bouton de donation */}
      <div className="pb-1 flex-shrink-0">
        <UIDonationLink
          aria-label="Lien de donation"
          data-testid="music-donation-link"
        />
      </div>
      {/* Barre de recherche */}
      <UISearchbar
        data-testid="music-searchbar-input"
        aria-label="Rechercher une musique, un artiste..."
        placeholder="Rechercher une musique, un artiste..."
        role="searchbox"
        value={search}
        autoFocus={true}
        onChange={e => setSearch(e.target.value)}
        icon={<Icon icon="mdi:search" width={24} height={24} color="black" className="mr-2" />}
      />
      {/* Liste scrollable des musiques */}
      <div
        className="flex-1 overflow-y-auto flex flex-col gap-3 pb-4"
        onScroll={() => setIsAtBottom(true)}
        onScrollEnd={() => setIsAtBottom(false)}
        role="list"
        aria-label="Liste des musiques"
        aria-live="polite"
      >
        {isLoading && <div className="text-center text-gray-400 mt-8">Chargement...</div>}
        {!isLoading && filtered?.length === 0 && (
          <div className="text-center text-gray-400 mt-8">Aucune musique trouvée.</div>
        )}
        {filtered?.map((music) => (
          <UIMusicItem
            aria-label={`Musique ${music.name} de ${music.artist}`}
            data-testid={`music-item-${music.id}`}
            role="listitem"
            key={music.id}
            music={music}
          />
        ))}
      </div>
      {/* Bouton flottant pour upload */}
      <button
        aria-label="Téléverser une musique"
        data-testid="music-upload-button"
        onClick={handleUploadClick}
        className={
          `bottom-26 fixed right-8 z-50 bg-black text-white shadow-xl rounded-full w-15 h-15 flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-all duration-300
          ${isAtBottom ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}
          `
        }
        title="Téléverser une musique"
      >
        <Icon icon="mdi:music-note-plus" width={28} height={28} />
      </button>
      <input
        role="presentation"
        type="file"
        name="file"
        accept={'audio/*'}
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default MusicPage;
