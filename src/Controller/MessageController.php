<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use App\Service\MessageService;
use App\Dto\MessagePayloadDto;
use OpenApi\Attributes as OA;
use App\Entity\Message;

#[OA\Tag(name: 'Message')]
final class MessageController extends AbstractController
{
    #[OA\RequestBody(
        description: 'Données du message à envoyer',
        required: true,
        content: new Model(type: MessagePayloadDto::class, groups: ['message:send'])
    )]
    #[OA\Response(
        response: 200,
        description: 'Message envoyé avec succès',
    )]
    #[Route('/api/v1/message/send', name: 'api.v1.message.send', methods: ['POST'])]
    public function sendMessage(
        MessageService $messageService,
        #[MapRequestPayload(
            acceptFormat: 'json',
            serializationContext: ['groups' => ['message:send']],
            validationGroups: ['message:send']
        )] MessagePayloadDto $messagePayloadDto,
        EntityManagerInterface $em
    ): Response {
        // Envoyer le message via le service
        // TODO: séparer la fonction "publish" du service
        $messageService->sendMessage($this->getUser(), $messagePayloadDto->content);

        // save message in database
        $message = new Message();
        $message->setContent($messagePayloadDto->content);
        $message->setOwner($this->getUser());

        $em->persist($message);
        $em->flush();

        // return no body content 200
        return new Response(null, Response::HTTP_OK);
    }
}
