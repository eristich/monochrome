<?php

namespace App\Tests\Controller;

use App\Tests\CustomTestCase;
use App\Entity\User;

final class AdministrationControllerTest extends CustomTestCase
{
    public function testEditUserByModeratorSuccess(): void
    {
        $client = $this->getAuthenticatedClientByEmail('moderator-user.test@monochrome.app');
        $userRepo = $this->getRepository(User::class);

        /** @var User $user */
        $user = $userRepo->findOneBy(['email' => 'basic-user.test@monochrome.app']);
        $this->assertNotNull($user);

        $payload = [
            'isBanned' => true,
            'isUploadEnable' => false
        ];

        $client->request(
            'PATCH',
            '/api/v1/administration/user/' . $user->getId()->toRfc4122(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertTrue($data['isBanned']);
        $this->assertFalse($data['isUploadEnable']);
    }

    public function testCantDowngradeAdminUserFromModeratorUser(): void
    {
        $client = $this->getAuthenticatedClientByEmail('moderator-user.test@monochrome.app');
        $userRepo = $this->getRepository(User::class);

        /** @var User $user */
        $user = $userRepo->findOneBy(['email' => 'admin-user.test@monochrome.app']);
        $this->assertNotNull($user);

        $payload = [
            'roles' => ['ROLE_MODERATOR']
        ];

        $client->request(
            'PATCH',
            '/api/v1/administration/user/' . $user->getId()->toRfc4122(),
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            json_encode($payload)
        );

        $this->assertResponseStatusCodeSame(401); // UnauthorizedHttpException
        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertArrayHasKey('error', $data);
    }
}
