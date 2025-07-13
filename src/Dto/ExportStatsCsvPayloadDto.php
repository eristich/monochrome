<?php

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;

class ExportStatsCsvPayloadDto
{
    #[Assert\NotBlank(message: 'La date de début est requise')]
    #[Assert\Date(message: 'Le format de date doit être Y-m-d')]
    public string $startDate;

    #[Assert\NotBlank(message: 'La date de fin est requise')]
    #[Assert\Date(message: 'Le format de date doit être Y-m-d')]
    public string $endDate;

    public function __construct(string $startDate, string $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function getStartDateTime(): \DateTimeImmutable
    {
        return new \DateTimeImmutable($this->startDate . ' 00:00:00');
    }

    public function getEndDateTime(): \DateTimeImmutable
    {
        return new \DateTimeImmutable($this->endDate . ' 23:59:59');
    }

    public function isValidDateRange(): bool
    {
        return $this->getStartDateTime() <= $this->getEndDateTime();
    }
}
