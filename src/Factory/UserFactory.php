<?php

namespace App\Factory;

use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Uid\Uuid;

class UserFactory
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function createUser(string $email, string $name, string $plainPassword, string $role = 'ROLE_USER', ?string $uuid = null): User
    {
        $user = new User();
        if ($uuid) {
            $user->setId(Uuid::fromString($uuid));
        }

        $user->setEmail($email);
        $user->setName($name);

        // Encoder le mot de passe
        $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
        $user->setPassword($hashedPassword);

        // Ajouter les rôles spécifiques
        $user->setRoles([$role]);

        return $user;
    }

    public function createAdmin(string $email, string $name, string $plainPassword, ?string $uuid = null): User
    {
        return $this->createUser($email, $name, $plainPassword, 'ROLE_ADMIN', $uuid);
    }

    public function createModerator(string $email, string $name, string $plainPassword, ?string $uuid = null): User
    {
        return $this->createUser($email, $name, $plainPassword, 'ROLE_MODERATOR', $uuid);
    }

    public function createBasicUser(string $email, string $name, string $plainPassword, ?string $uuid = null): User
    {
        return $this->createUser($email, $name, $plainPassword, 'ROLE_USER', $uuid);
    }

    public function createBannedUser(string $email, string $name, string $plainPassword, ?string $uuid = null): User
    {
        $user = $this->createUser($email, $name, $plainPassword, $uuid);
        // Assuming you have a method to set banned status
        $user->setIsBanned(true);
        return $user;
    }

    public function createDisallowedToUploadUser(string $email, string $name, string $plainPassword, ?string $uuid = null): User
    {
        $user = $this->createUser($email, $name, $plainPassword, $uuid);
        // Assuming you have a method to set upload permission
        $user->setIsUploadEnable(false);
        return $user;
    }
}
