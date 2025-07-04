<?php

namespace App\Tests\Controller;

use App\Tests\CustomTestCase;
use App\Entity\User;

class UserControllerTest extends CustomTestCase
{
    public function testCanGetCurrentUserInfo(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('GET', '/api/v1/user/me');

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertSame('0197bc57-124c-747d-b7a3-20eec51be0b2', $data['id']);
        $this->assertSame('John Doe', $data['name']);
        $this->assertSame('basic-user.test@monochrome.app', $data['email']);
        $this->assertContains('ROLE_USER', $data['roles']);
        // $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/', $data['createdAt']);
        // $this->assertMatchesRegularExpression('/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/', $data['updatedAt']);
        // $this->assertSame(true, $data['isUploadEnable']);
    }

    public function testCanRegisterNewUnauthenticatedUser(): void
    {
        $client = $this->getUnauthenticatedClient();

        $client->request('POST', '/api/v1/user/register', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'name' => 'Unitest01 User',
            'email' => 'unitest01.test@monochrome.app',
            'password' => 'Password#123',
        ]));

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertSame('Unitest01 User', $data['name']);
        $this->assertSame('unitest01.test@monochrome.app', $data['email']);
        $this->assertEquals(['ROLE_USER'], $data['roles']);
        // $this->assertSame(true, $data['isUploadEnable']);
    }

    public function testCanLoginWithStandardUser(): void
    {
        $client = $this->getUnauthenticatedClient();

        $client->request('POST', '/api/v1/login_check', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'email' => 'basic-user.test@monochrome.app',
            'password' => 'root',
        ]));

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertArrayHasKey('token', $data);
        $this->assertNotEmpty($data['token']);
    }

    public function testCanChangeSelfUserPassword(): void
    {
        $client = $this->getAuthenticatedClientByEmail('unitest01.test@monochrome.app');

        $client->request('POST', '/api/v1/user/change-password', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'password' => 'Password#123',
            'newPassword' => 'Password#1234',
        ]));

        $this->assertResponseStatusCodeSame(201);

        $user = $this->getRepository(User::class)->findOneBy(['email' => 'unitest01.test@monochrome.app']);
        $this->assertNotNull($user);
        $this->assertTrue(
            static::getContainer()->get('security.password_hasher')->isPasswordValid($user, 'Password#1234')
        );
    }

    public function testCanDeleteSelfUser(): void
    {
        $client = $this->getAuthenticatedClientByEmail('unitest01.test@monochrome.app');
        $client->request('DELETE', '/api/v1/user');
        $this->assertResponseStatusCodeSame(204);

        $deletedUser = $this->getRepository(User::class)->findOneBy(['email' => 'unitest01.test@monochrome.app']);
        $this->assertNull($deletedUser);
    }
}
