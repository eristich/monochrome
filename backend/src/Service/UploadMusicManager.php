<?php

namespace App\Service;

use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mime\MimeTypesInterface;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\Music;
use App\Entity\User;
use getID3;

class UploadMusicManager
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private MimeTypesInterface $mimeTypes
    ) {}

    /**
     * Upload et traite un fichier musical
     */
    public function uploadMusic(UploadedFile $file, User $owner): Music
    {
        // Valider le fichier
        $this->validateFile($file);

        // Analyser les métadonnées du fichier
        $metadata = $this->extractMetadata($file);

        // Créer l'entité Music
        $music = $this->createMusicEntity($file, $metadata, $owner);

        // Sauvegarder en base de données
        $this->entityManager->persist($music);
        $this->entityManager->flush();

        return $music;
    }

    /**
     * Valide le fichier uploadé
     */
    private function validateFile(UploadedFile $file): void
    {
        // Vérifier si un fichier est fourni
        if (!$file) {
            throw new BadRequestHttpException('No file provided');
        }

        // Valider le type et la taille du fichier
        $errors = $this->validator->validate($file, [
            new File([
                'maxSize' => '15M',
                'mimeTypes' => [
                    'audio/mpeg',       // MP3
                    'audio/mp3',        // MP3 (alternative)
                ],
                'mimeTypesMessage' => 'Please upload a valid audio file (MP3)',
            ])
        ]);

        if (count($errors) > 0) {
            throw new BadRequestHttpException($errors->get(0)->getMessage());
        }
    }

    /**
     * Extrait les métadonnées du fichier audio
     */
    private function extractMetadata(UploadedFile $file): array
    {
        $getID3 = new getID3();
        $audio = $getID3->analyze($file->getPathname());

        // Extraire les métadonnées avec des valeurs par défaut
        $metadata = [
            'title' => $audio['tags']['id3v2']['title'][0] ??
                      $audio['tags']['id3v1']['title'][0] ??
                      $file->getClientOriginalName(),
            'artist' => $audio['tags']['id3v2']['artist'][0] ??
                       $audio['tags']['id3v1']['artist'][0] ??
                       'Unknown Artist',
            'album' => $audio['tags']['id3v2']['album'][0] ??
                      $audio['tags']['id3v1']['album'][0] ??
                      null,
            'year' => $audio['tags']['id3v2']['year'][0] ??
                     $audio['tags']['id3v1']['year'][0] ??
                     null,
        ];

        // Extraire la pochette d'album si disponible
        if (isset($audio['comments']['picture'][0])) {
            $metadata['cover'] = [
                'mime_type' => $audio['comments']['picture'][0]['image_mime'] ?? null,
                'data' => $audio['comments']['picture'][0]['data'] ?? null,
            ];
        }

        return $metadata;
    }

    /**
     * Crée l'entité Music avec les données du fichier
     */
    private function createMusicEntity(UploadedFile $file, array $metadata, User $owner): Music
    {
        $music = new Music();

        // Définir les propriétés de base
        $music->setName($metadata['title'])
              ->setArtist($metadata['artist'])
              ->setOriginalFilename($file->getClientOriginalName())
              ->setOwner($owner);

        // Stocker le fichier binaire
        $binaryData = file_get_contents($file->getPathname());
        $music->setBinaryFile($binaryData);

        // Stocker la pochette d'album si disponible
        if (isset($metadata['cover']) && $metadata['cover']['data']) {
            $music->setBinaryCover($metadata['cover']['data']);
        }

        return $music;
    }

    /**
     * Met à jour les métadonnées d'une musique existante
     */
    public function updateMusicMetadata(Music $music, array $metadata): Music
    {
        if (isset($metadata['name'])) {
            $music->setName($metadata['name']);
        }

        if (isset($metadata['artist'])) {
            $music->setArtist($metadata['artist']);
        }

        $this->entityManager->persist($music);
        $this->entityManager->flush();

        return $music;
    }

    /**
     * Supprime une musique et ses données associées
     */
    public function deleteMusic(Music $music): bool
    {
        try {
            $this->entityManager->remove($music);
            $this->entityManager->flush();
            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Récupère le contenu binaire d'une musique
     */
    public function getMusicBinaryContent(Music $music): ?string
    {
        return $music->getBinaryFile();
    }

    /**
     * Récupère le contenu binaire de la pochette d'une musique
     */
    public function getMusicCoverBinaryContent(Music $music): ?string
    {
        return $music->getBinaryCover();
    }

    /**
     * Vérifie si une musique a une pochette d'album
     */
    public function hasCover(Music $music): bool
    {
        return $music->getBinaryCover() !== null;
    }

    /**
     * Obtient le type MIME de la pochette d'album
     */
    public function getCoverMimeType(Music $music): ?string
    {
        if (!$this->hasCover($music)) {
            return null;
        }

        // Analyser le contenu binaire pour déterminer le type MIME
        $coverData = $music->getBinaryCover();
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_buffer($finfo, $coverData);
        finfo_close($finfo);

        return $mimeType;
    }
}
