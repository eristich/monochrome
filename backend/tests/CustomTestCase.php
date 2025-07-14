<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Bundle\FrameworkBundle\KernelBrowser;
use Doctrine\ORM\EntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class CustomTestCase extends WebTestCase
{
    private KernelBrowser $client;

    // configure the client with Bearer token
    protected function getAuthenticatedClientByEmail(string $email): KernelBrowser
    {
        if (!isset($this->client)) {
            static::ensureKernelShutdown();
            $this->client = static::createClient();
        }

        $container = static::getContainer();
        $user = $container->get('doctrine')->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user) {
            throw new \Exception("Aucun utilisateur avec l'email $email");
        }

        $jwtManager = $this->getContainer()->get('lexik_jwt_authentication.jwt_manager');
        $token = $jwtManager->create($user);

        $this->client->setServerParameters([
            'HTTP_Authorization' => 'Bearer ' . $token,
        ]);

        return $this->client;
    }

    /**
     * Retourne un nouveau client non authentifié.
     */
    protected function getUnauthenticatedClient(): KernelBrowser
    {
        static::ensureKernelShutdown();
        return static::createClient();
    }

    /**
     * Retourne le repository Doctrine pour une entité donnée.
     */
    protected function getRepository(string $entityClass): EntityRepository
    {
        return static::getContainer()->get('doctrine')->getRepository($entityClass);
    }

    /**
     * Retourne l'EntityManager Doctrine.
     */
    protected function getEntityManager(): EntityManagerInterface
    {
        return static::getContainer()->get('doctrine')->getManager();
    }
}