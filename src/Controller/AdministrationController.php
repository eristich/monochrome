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
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;
use App\Entity\User;

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
}
