<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ValidPasswordRecoveryPayloadDto
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 5)]
    public string $code;

    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 255)]
    public string $password;

    #[Assert\NotBlank]
    #[Assert\Email]
    public string $email;

    public function __construct(string $code, string $password, string $email)
    {
        $this->code = $code;
        $this->password = $password;
        $this->email = $email;
    }
}