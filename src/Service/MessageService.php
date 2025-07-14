<?php

namespace App\Service;

use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Mercure\HubInterface;
use Symfony\Component\Mercure\Update;
use App\Dto\MessagePayloadDto;
use App\Entity\User;

class MessageService
{
    public function __construct(
        private HubInterface $hub,
        private SerializerInterface $serializer
    ) {}

    public function sendMessage(User $user, string $content): MessagePayloadDto
    {
        // Créer le DTO du message
        $messageData = new MessagePayloadDto();
        $messageData->content = $content;
        $messageData->userId = $user->getId()->__toString();
        $messageData->username = $user->getName();

        // Sérialiser le message pour Mercure
        $messageJson = $this->serializer->serialize($messageData, 'json', ['groups' => ['message:over-sse']]);

        // Créer et publier l'update Mercure
        $update = new Update(
            'message', // Topic
            $messageJson,
            false
        );

        $this->hub->publish($update);

        return $messageData;
    }
}
