<?php

namespace App\Service;

use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Serializer\SerializerInterface;
use App\Repository\UserRepository;
use App\Entity\User;

class ExportUserDataService
{
    public function __construct(
        private SerializerInterface $serializer,
        private UserRepository $userRepository,
        private NormalizerInterface $normalizer,
    ) {}

    /**
     * Exporte les données personnelles d'un utilisateur au format JSON (RGPD)
     * Inclut les musiques publiées (hors binaires/covers).
     */
    public function exportUserData(User $user): string
    {
        $user = $this->userRepository->find($user->getId());
        $data = $this->normalizer->normalize($user, null, ['groups' => ['user:export-data']]);
        // ajoute des métadonnées concernant l'export
        $data['exported_at'] = new \DateTimeImmutable();
        return $this->serializer->serialize($data, 'json');
    }
}
