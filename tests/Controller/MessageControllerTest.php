<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Tests\CustomTestCase;
use Symfony\Component\HttpFoundation\Response;

class MessageControllerTest extends CustomTestCase
{
    public function testSendMessageRequiresAuthentication(): void
    {
        $client = $this->getUnauthenticatedClient();
        $client->request('POST', '/api/v1/message/send', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode(['content' => 'Test message']));

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testSendMessageWithValidData(): void
    {
        // Se connecter avec JWT
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('POST', '/api/v1/message/send', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode(['content' => 'Test message']));

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        // Vérifier que la réponse est vide (200 sans contenu)
        $this->assertEmpty($client->getResponse()->getContent());
    }

    public function testSendMessageWithEmptyContent(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('POST', '/api/v1/message/send', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode(['content' => '']));

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);

        $responseData = json_decode($client->getResponse()->getContent(), true);
        $this->assertArrayHasKey('error', $responseData);
    }
}
