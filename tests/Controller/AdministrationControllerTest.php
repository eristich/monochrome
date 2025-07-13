<?php

namespace App\Tests\Controller;

use Symfony\Component\HttpFoundation\StreamedResponse;
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

    public function testCanExportStatsCsvSuccess(): void
    {
        $client = $this->getAuthenticatedClientByEmail('moderator-user.test@monochrome.app');

        $client->request('GET', '/api/v1/administration/stats/export-csv?startDate=2024-01-15&endDate=2024-01-20');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'text/csv; charset=utf-8');
        $this->assertResponseHeaderSame('Content-Disposition', 'attachment; filename="stats_diffusion_2024-01-15_to_2024-01-20.csv"');

        $response = $client->getResponse();
        $this->assertInstanceOf(StreamedResponse::class, $response);
    }

    public function testCanGetCompleteUsersListWithPagination(): void
    {
        $client = $this->getAuthenticatedClientByEmail('moderator-user.test@monochrome.app');

        $client->request('GET', '/api/v1/administration/users?page=1&limit=3');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertCount(3, $data);
    }

    public function testCantGetUsersListWithUnauthorizedUser(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('GET', '/api/v1/administration/users');

        $this->assertResponseStatusCodeSame(403);
    }
}
