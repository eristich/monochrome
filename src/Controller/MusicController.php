<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\HttpKernel\Attribute\MapUploadedFile;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Requirement\Requirement;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\ExpressionLanguage\Expression;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;
use Nelmio\ApiDocBundle\Attribute\Security;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use App\Service\UploadMusicManager;
use App\Repository\MusicRepository;
use OpenApi\Attributes as OA;
use App\Entity\Music;

#[OA\Tag(name: 'Music')]
final class MusicController extends AbstractController
{
    #[OA\RequestBody(
        description: 'Upload a music file',
        required: true,
        content: new OA\MediaType(
            mediaType: 'multipart/form-data',
            schema: new OA\Schema(
                type: 'object',
                properties: [
                    new OA\Property(
                        property: 'file',
                        type: 'string',
                        format: 'binary',
                        description: 'The music file to upload'
                    )
                ],
                required: ['file']
            )
        )
    )]
    #[OA\Response(
        response: 201,
        description: 'Get the current logged user information',
        content: new Model(type: Music::class, groups: ['music:get-one'])
    )]
    #[Route('/api/v1/music/upload', name: 'api.v1.music.upload', methods: ['POST'])]
    public function addMusic(
        #[MapUploadedFile] UploadedFile                         $file,
        UploadMusicManager                                      $uploadManager,
    ): JsonResponse {
        // Utiliser le service d'upload
        $music = $uploadManager->uploadMusic($file, $this->getUser());

        return $this->json($music, Response::HTTP_CREATED, [], ['groups' => ['music:get-one']]);
    }




    #[OA\Parameter(
        name: 'musicId',
        description: 'The ID of the music to retrieve',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 200,
        description: 'Get the music information',
        content: new Model(type: Music::class, groups: ['music:get-one'])
    )]
    #[Route('/api/v1/music/{musicId}', name: 'api.v1.music.get-one', methods: ['GET'], requirements: ['musicId' => Requirement::UUID])]
    public function getOne(
        #[MapEntity(id: 'musicId')]    Music    $music,
        NormalizerInterface                     $normalizer
    ): JsonResponse
    {
        return $this->json($normalizer->normalize(
            $music, null, ['groups' => ['music:get-one']]
        ), Response::HTTP_OK);
    }




    #[OA\Parameter(
        name: 'limit',
        description: 'Number of items per page',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 10)
    )]
    #[OA\Parameter(
        name: 'page',
        description: 'Page number',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'integer', default: 1)
    )]
    #[OA\Parameter(
        name: 'order',
        description: 'Order of the item list',
        in: 'query',
        required: false,
        schema: new OA\Schema(type: 'string', default: 'DESC')
    )]
    #[OA\Response(
        response: 200,
        description: 'Get the music collection',
        content: new OA\JsonContent(
            type: 'array',
            items: new OA\Items(ref: new Model(type: Music::class, groups: ['music:get-collection']))
        )
    )]
    #[Route('/api/v1/music', name: 'api.v1.music.get-collection', methods: ['GET'])]
    public function getCollection(
        MusicRepository                         $musicRepository,
        NormalizerInterface                     $normalizer,
        Request                                 $request
    ): JsonResponse
    {
        $limit = max(min($request->query->getInt('limit', 10), 1), 20);
        $limit = (1 <= $limit) && ($limit <= 30) ? $limit : 20;
        $page = min($request->query->getInt('page', 1), 1);
        $offset = ($page - 1) * $limit;
        $order = strtoupper($request->query->getString('order', 'DESC'));
        $order = in_array($order, ['DESC', 'ASC', 'desc', 'asc']) ? $order : 'DESC';

        $music = $musicRepository->findBy(
            ['owner' => $this->getUser()],
            ['id' => $order],
            $limit,
            $offset
        );

        return $this->json($normalizer->normalize(
            $music, null, ['groups' => ['music:get-collection']]
        ), Response::HTTP_OK);
    }




    #[OA\Parameter(
        name: 'musicId',
        description: 'The ID of the music to delete',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\Response(
        response: 204,
        description: 'Music deleted successfully',
    )]
    #[IsGranted(
        attribute: new Expression('user === subject["owner"] or is_granted("ROLE_ADMIN")'),
        message: 'You do not have permission to remove this music.',
        subject: [
            'owner' => new Expression('args["music"].getOwner()'),
        ],
    )]
    #[Route('/api/v1/music/{musicId}', name: 'api.v1.music.delete', methods: ['DELETE'], requirements: ['musicId' => Requirement::UUID])]
    public function delete(
        #[MapEntity(id: 'musicId')] Music       $music,
        \App\Service\UploadMusicManager         $uploadManager
    ): JsonResponse
    {
        $success = $uploadManager->deleteMusic($music);

        if (!$success) {
            return $this->json(['error' => 'Failed to delete music'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        return new JsonResponse(null, Response::HTTP_NO_CONTENT, [], false);
    }




    #[OA\Response(
        response: 200,
        description: 'Get a random music file',
        content: new OA\MediaType(mediaType: 'audio/mpeg')
    )]
    #[Security(name: null)]
    #[Route('/api/v1/music/select', name: 'api.v1.music.get-random', methods: ['GET'])]
    public function getRandom(
        MusicRepository                         $musicRepository,
        \App\Service\UploadMusicManager         $uploadManager,
    ): Response
    {
        // find all music from the database, denormalize, and make random selection
        /** @var Music[] $musicList */
        $musicList = $musicRepository->findAll();
        $randomMusic = $musicList[array_rand($musicList)];

        $response = new StreamedResponse(function () use ($randomMusic, $uploadManager) {
            // Get binary content from the service
            $binaryContent = $uploadManager->getMusicBinaryContent($randomMusic);

            // Output the binary content in chunks
            $chunkSize = 1024;
            $length = strlen($binaryContent);

            for ($i = 0; $i < $length; $i += $chunkSize) {
                echo substr($binaryContent, $i, $chunkSize);
                flush();
            }
        });

        // Set the response headers
        $response->headers->set('Content-Type', 'audio/mpeg');
        $response->headers->set('Content-Disposition', 'inline; filename="'.$randomMusic->getOriginalFilename().'"');
        $response->headers->set('Content-Length', strlen($uploadManager->getMusicBinaryContent($randomMusic)));

        return $response;
    }




    #[OA\Parameter(
        name: 'musicId',
        description: 'The ID of the music to edit',
        in: 'path',
        required: true,
        schema: new OA\Schema(type: 'string', format: 'uuid')
    )]
    #[OA\RequestBody(
        description: 'Music edit data',
        content: new Model(type: Music::class, groups: ['music:user-edit'])
    )]
    #[OA\Response(
        response: 200,
        description: 'Music edited successfully',
        content: new Model(type: Music::class, groups: ['music:get-one'])
    )]
    #[IsGranted(
        attribute: new Expression('user === subject["owner"] or is_granted("ROLE_ADMIN")'),
        message: 'You do not have permission to edit this music.',
        subject: [
            'owner' => new Expression('args["music"].getOwner()'),
        ],
    )]
    #[Route('/api/v1/music/{musicId}', name: 'api.v1.music.edit', methods: ['PATCH'], requirements: ['musicId' => Requirement::UUID])]
    public function edit(
        #[MapEntity(id: 'musicId')] Music       $music,
        Request                                 $request,
        NormalizerInterface                     $normalizer,
        SerializerInterface                     $serializer,
        EntityManagerInterface                  $entityManager
    ): JsonResponse
    {
        /** @var Music $userEdit */
        $userEdit = $serializer->deserialize(
            $request->getContent(),
            Music::class,
            'json',
            ['groups' => ['music:user-edit']]
        );

        $music->setName($userEdit->getName() ?? $music->getName());
        $music->setArtist($userEdit->getArtist() ?? $music->getArtist());

        $entityManager->persist($music);
        $entityManager->flush();

        return $this->json(
            $normalizer->normalize($music, null, ['groups' => ['music:get-one']]),
            Response::HTTP_OK
        );
    }
}
