<?php

namespace App\Dto;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class MessagePayloadDto
{
    #[Assert\NotBlank(
        message: 'Le contenu du message ne peut pas être vide',
        groups: ['message:send']
    )]
    #[Assert\Length(
        max: 300,
        maxMessage: 'Le message ne peut pas dépasser {{ limit }} caractères',
        groups: ['message:send']
    )]
    #[Groups(['message:over-sse', 'message:send'])]
    public string $content;

    #[Groups(['message:over-sse'])]
    public string $userId;

    #[Groups(['message:over-sse'])]
    public string $username;

    #[Groups(['message:over-sse'])]
    public \DateTimeImmutable $date;

    #[Groups(['message:over-sse'])]
    public string $id;

    public function __construct()
    {
        $this->date = new \DateTimeImmutable();
        $this->id = uniqid('msg_', true);
    }
}
