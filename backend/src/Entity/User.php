<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Bridge\Doctrine\Types\UuidType;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\Column(type: UuidType::NAME, unique: true)]
    #[Groups(['music:get-one', 'user:get-self', 'music:get-collection', 'user:get-one', 'user:admin-get', 'user:export-data'])]
    private ?Uuid $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['music:get-one', 'user:get-self', 'user:register', 'music:get-collection', 'user:get-one', 'user:admin-get', 'user:export-data'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['user:get-self', 'user:request-password-recovery', 'user:register', 'user:admin-get', 'user:export-data'])]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user:get-self', 'user:admin-edit', 'user:admin-get'])]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user:register', 'user:export-data'])]
    private ?string $password = null;

    /**
     * @var Collection<int, Music>
     */
    #[ORM\OneToMany(targetEntity: Music::class, mappedBy: 'owner')]
    #[Groups(['user:export-data'])]
    private Collection $music;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:valid-password-recovery'])]
    private ?string $recoveryCode = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:admin-get', 'user:export-data'])]
    private ?\DateTimeImmutable $recoveryCodeExpiration = null;

    #[ORM\Column]
    #[Groups(['user:get-self', 'user:admin-get', 'user:export-data'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column]
    #[Groups(['user:get-self', 'user:admin-get', 'user:export-data'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:admin-get', 'user:export-data'])]
    private ?\DateTimeImmutable $lastLoginAt = null;

    #[ORM\Column]
    #[Groups(['user:admin-edit', 'user:admin-get'])]
    private ?bool $isBanned = null;

    #[ORM\Column]
    #[Groups(['user:admin-edit', 'user:get-self', 'user:admin-get'])]
    private ?bool $isUploadEnable = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:admin-get', 'user:export-data'])]
    private ?\DateTimeImmutable $lastActivityAt = null;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'owner')]
    private Collection $messages;

    public function __construct()
    {
        $this->id =         Uuid::v4();
        $this->music =      new ArrayCollection();
        $this->isBanned =   false;
        $this->isUploadEnable = true;
        $this->updatedAt =  new \DateTimeImmutable();
        $this->createdAt =  new \DateTimeImmutable();
        $this->messages = new ArrayCollection();
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getRecoveryCode(): ?string
    {
        return $this->recoveryCode;
    }

    public function setRecoveryCode(?string $recoveryCode): static
    {
        $this->recoveryCode = $recoveryCode;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Music>
     */
    public function getMusic(): Collection
    {
        return $this->music;
    }

    public function addMusic(Music $music): static
    {
        if (!$this->music->contains($music)) {
            $this->music->add($music);
            $music->setOwner($this);
        }

        return $this;
    }

    public function removeMusic(Music $music): static
    {
        if ($this->music->removeElement($music)) {
            // set the owning side to null (unless already changed)
            if ($music->getOwner() === $this) {
                $music->setOwner(null);
            }
        }

        return $this;
    }

    public function getRecoveryCodeExpiration(): ?\DateTimeImmutable
    {
        return $this->recoveryCodeExpiration;
    }

    public function setRecoveryCodeExpiration(?\DateTimeImmutable $recoveryCodeExpiration): static
    {
        $this->recoveryCodeExpiration = $recoveryCodeExpiration;

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

    public function getLastLoginAt(): ?\DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): static
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    public function isBanned(): ?bool
    {
        return $this->isBanned;
    }

    public function setIsBanned(bool $isBanned): static
    {
        $this->isBanned = $isBanned;

        return $this;
    }

    public function isUploadEnable(): ?bool
    {
        return $this->isUploadEnable;
    }

    public function setIsUploadEnable(bool $isUploadEnable): static
    {
        $this->isUploadEnable = $isUploadEnable;

        return $this;
    }

    public function getLastActivityAt(): ?\DateTimeImmutable
    {
        return $this->lastActivityAt;
    }

    public function setLastActivityAt(?\DateTimeImmutable $lastActivityAt): static
    {
        $this->lastActivityAt = $lastActivityAt;

        return $this;
    }

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setOwner($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            // set the owning side to null (unless already changed)
            if ($message->getOwner() === $this) {
                $message->setOwner(null);
            }
        }

        return $this;
    }
}
