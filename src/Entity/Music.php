<?php

namespace App\Entity;

use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Bridge\Doctrine\Types\UuidType;
use App\Repository\MusicRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Doctrine\DBAL\Types\Types;

#[ORM\Entity(repositoryClass: MusicRepository::class)]
class Music
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[Groups(['music:get-one', 'music:get-collection', 'user:export-data'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['music:get-one', 'music:user-edit', 'music:get-collection', 'user:export-data'])]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'music')]
    #[Groups(['music:get-one', 'music:get-collection'])]
    private ?User $owner = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['music:get-one', 'music:user-edit', 'music:get-collection', 'user:export-data'])]
    private ?string $artist = null;

    #[ORM\Column(length: 255)]
    #[Groups(['music:get-one', 'music:get-collection', 'user:export-data'])]
    private ?string $originalFilename = null;

    #[ORM\Column]
    #[Groups(['music:get-one', 'music:get-collection', 'user:export-data'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column]
    #[Groups(['music:get-one', 'music:get-collection', 'user:export-data'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::BLOB)]
    private $binaryFile = null;

    #[ORM\Column(type: Types::BLOB, nullable: true)]
    private $binaryCover = null;

    public function __construct()
    {
        $this->id = Uuid::v4();
        $this->updatedAt = new \DateTimeImmutable();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function setId(Uuid $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getArtist(): ?string
    {
        return $this->artist;
    }

    public function setArtist(?string $artist): static
    {
        $this->artist = $artist;

        return $this;
    }

    public function getOriginalFilename(): ?string
    {
        return $this->originalFilename;
    }

    public function setOriginalFilename(string $originalFilename): static
    {
        $this->originalFilename = $originalFilename;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getBinaryFile()
    {
        return $this->binaryFile;
    }

    public function setBinaryFile($binaryFile): static
    {
        $this->binaryFile = $binaryFile;

        return $this;
    }

    public function getBinaryCover()
    {
        return $this->binaryCover;
    }

    public function setBinaryCover($binaryCover): static
    {
        $this->binaryCover = $binaryCover;

        return $this;
    }
}
