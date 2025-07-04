<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ChangePasswordPayloadDto
{
    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 255)]
    public string $password;

    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 255)]
    public string $newPassword;

    public function __construct(string $password, string $newPassword)
    {
        $this->password = $password;
        $this->newPassword = $newPassword;
    }
}