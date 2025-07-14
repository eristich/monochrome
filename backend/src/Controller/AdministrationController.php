<?php

namespace App\Controller;

use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;
use App\Entity\User;
use App\Repository\StatDiffusionRepository;
use App\Repository\UserRepository;
use App\Dto\ExportStatsCsvPayloadDto;

#[OA\Tag(name: 'Administration')]
final class AdministrationController extends AbstractController
{
    #[OA\RequestBody(
        description: 'User edit data',
        content: new Model(type: User::class, groups: ['user:admin-edit'])
    )]
    #[OA\Parameter(
        name: 'userId',
        in: 'path',
        required: true,
        description: 'User ID',
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'User edited successfully',
        content: new Model(type: User::class, groups: ['user:admin-get'])
    )]
    #[Route('/api/v1/administration/user/{userId}', name: 'api.v1.administration.user.edit', methods: ['PATCH'], requirements: ['userId' => Requirement::UUID])]
    #[IsGranted('ROLE_MODERATOR')]
    public function editUser(
        #[MapEntity(id: 'userId')] User     $user,
        Request                             $request,
        SerializerInterface                 $serializer,
        NormalizerInterface                 $normalizer,
        EntityManagerInterface              $em,
    ): JsonResponse {
        /** @var User $userEdit */
        $userEdit = $serializer->deserialize(
            $request->getContent(),
            User::class,
            'json',
            ['groups' => ['user:admin-edit']]
        );

        // si l'utilisateur moderateur essaie de modifier les roles d'un admin, on retourne erreur 401
        if (in_array('ROLE_ADMIN', $user->getRoles()) && !in_array('ROLE_ADMIN', $this->getUser()->getRoles())) {
            throw new UnauthorizedHttpException('check your roles', 'Impossible de modifier les roles d\'un administrateur si vous n\'êtes pas administrateur');
        }

        $user->setIsBanned($userEdit->isBanned() ?? $user->isBanned());
        $user->setIsUploadEnable($userEdit->isUploadEnable() ?? $user->isUploadEnable());
        $user->setRoles(
            $this->isGranted('ROLE_ADMIN')
            ? ($userEdit->getRoles() ?? $user->getRoles())
            : $user->getRoles()
        );
        $user->setUpdatedAt(new \DateTimeImmutable());

        $em->persist($user);
        $em->flush();

        return $this->json(
            $normalizer->normalize($user, null, ['groups' => ['user:admin-get']]),
            Response::HTTP_OK
        );
    }

    #[OA\QueryParameter(
        name: 'page',
        in: 'query',
        required: false,
        description: 'Numéro de page (défaut: 1)',
        schema: new OA\Schema(type: 'integer', minimum: 1, default: 1)
    )]
    #[OA\QueryParameter(
        name: 'limit',
        in: 'query',
        required: false,
        description: 'Nombre d\'utilisateurs par page (défaut: 10, max: 50)',
        schema: new OA\Schema(type: 'integer', minimum: 1, maximum: 50, default: 10)
    )]
    #[OA\Response(
        response: 200,
        description: 'Liste des utilisateurs avec pagination',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: User::class, groups: ['user:admin-get']))
        )
    )]
    #[Route('/api/v1/administration/users', name: 'api.v1.administration.users.list', methods: ['GET'])]
    #[IsGranted('ROLE_MODERATOR')]
    public function getUsers(
        Request $request,
        UserRepository $userRepository,
        NormalizerInterface $normalizer
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(50, max(1, (int) $request->query->get('limit', 10)));

        /** @var User[] $users */
        $users = $userRepository->findBy(
            [], ['createdAt' => 'DESC'], $limit, ($page - 1) * $limit
        );

        return new JsonResponse(
            $normalizer->normalize($users, null, ['groups' => ['user:admin-get']]),
            Response::HTTP_OK
        );
    }

    #[OA\QueryParameter(
        name: 'startDate',
        in: 'query',
        required: true,
        description: 'Date de début',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\QueryParameter(
        name: 'endDate',
        in: 'query',
        required: true,
        description: 'Date de fin',
        schema: new OA\Schema(type: 'string', format: 'date')
    )]
    #[OA\Response(
        response: 200,
        description: 'Export CSV des statistiques de diffusion',
        content: new OA\MediaType(mediaType: 'text/csv')
    )]
    #[Route('/api/v1/administration/stats/export-csv', name: 'api.v1.administration.stats.export-csv', methods: ['GET'])]
    #[IsGranted('ROLE_MODERATOR')]
    public function exportStatsCsv(
        Request $request,
        StatDiffusionRepository $statDiffusionRepository,
        ValidatorInterface $validator
    ): Response {
        $payload = new ExportStatsCsvPayloadDto(
            $request->query->get('startDate', ''),
            $request->query->get('endDate', '')
        );
        // Validation du DTO
        $violations = $validator->validate($payload);
        if (count($violations) > 0) {
            $errors = [];
            foreach ($violations as $violation) {
                $errors[] = $violation->getMessage();
            }
            return $this->json(['error' => implode(', ', $errors)], Response::HTTP_BAD_REQUEST);
        }

        // Validation de la plage de dates
        if (!$payload->isValidDateRange()) {
            return $this->json(['error' => 'La date de début doit être antérieure à la date de fin'], Response::HTTP_BAD_REQUEST);
        }

        $stats = $statDiffusionRepository->findByDateRange($payload->getStartDateTime(), $payload->getEndDateTime());

        $response = new StreamedResponse(function () use ($stats) {
            $handle = fopen('php://output', 'w');

            // En-têtes CSV
            fputcsv($handle, ['ID', 'Nom', 'Artiste', 'Durée (secondes)', 'Date de diffusion'], ';');

            // Données
            foreach ($stats as $stat) {
                fputcsv($handle, [
                    $stat->getId(),
                    $stat->getName(),
                    $stat->getArtist() ?? '-',
                    $stat->getDuration() ?? '-',
                    $stat->getCreatedAt()->format('Y-m-d H:i:s')
                ], ';');
            }

            fclose($handle);
        });

        $response->headers->set('Content-Type', 'text/csv; charset=utf-8');
        $response->headers->set(
            'Content-Disposition',
            'attachment; filename="stats_diffusion_' . $payload->getStartDateTime()->format('Y-m-d') . '_to_' . $payload->getEndDateTime()->format('Y-m-d') . '.csv"'
        );

        return $response;
    }
}
