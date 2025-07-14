<?php

namespace App\Tests\Controller;

use App\Tests\CustomTestCase;
use App\Entity\Music;
use App\Entity\User;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MusicControllerTest extends CustomTestCase
{
    public function testCanGetMusicCollection(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('GET', '/api/v1/music');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertCount(2, $data); // 2 musiques dans les fixtures

        // Vérifier la structure de la première musique
        $firstMusic = $data[0];
        $this->assertArrayHasKey('id', $firstMusic);
        $this->assertArrayHasKey('name', $firstMusic);
        $this->assertArrayHasKey('artist', $firstMusic);
        $this->assertArrayHasKey('originalFilename', $firstMusic);
        $this->assertArrayHasKey('createdAt', $firstMusic);
        $this->assertArrayHasKey('updatedAt', $firstMusic);
    }

    public function testCanGetMusicCollectionWithPagination(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('GET', '/api/v1/music?limit=10&page=1');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        //dd($data);
        $this->assertIsArray($data);
        $this->assertCount(2, $data);
    }

    public function testCanGetOneMusic(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('GET', '/api/v1/music/b0f05c3b-d289-408e-87e9-274f29305c56');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);
        $this->assertSame('b0f05c3b-d289-408e-87e9-274f29305c56', $data['id']);
        $this->assertSame('Chameleon', $data['name']);
        $this->assertSame('Hicham Chahidi', $data['artist']);
        $this->assertSame('Chameleon.mp3', $data['originalFilename']);
    }

    public function testCannotGetNonExistentMusic(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $nonExistentId = Uuid::v4();
        $client->request('GET', '/api/v1/music/' . $nonExistentId);

        $this->assertResponseStatusCodeSame(404);
    }

    public function testCanUploadMusicFile(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        // get music mp3 from "music-fixtures" directory
        $musicFilePath = $this->getContainer()->get('kernel')->getProjectDir() . '/music-fixtures/KUWAGO-Toybox5-01_Do_you_wanna_funk.mp3';
        $uploadedFile = new UploadedFile(
            $musicFilePath,
            'KUWAGO-Toybox5-01_Do_you_wanna_funk.mp3',
            'audio/mp3',
            UPLOAD_ERR_OK,
            true
        );

        $client->request('POST', '/api/v1/music/upload', [], [
            'file' => $uploadedFile, [], [
                'CONTENT_TYPE' => 'multipart/form-data',
            ]
        ]);

        // Note: Ce test échouera probablement car le contrôleur a un dd($file) qui arrête l'exécution
        // Une fois que le dd() sera retiré, ce test fonctionnera
        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertIsArray($data);

        $this->assertArrayHasKey('id', $data);
        $this->assertSame('KUWAGO-Toybox5-01_Do_you_wanna_funk.mp3', $data['originalFilename']);
        $this->assertSame('Do you wanna funk', $data['name']);
        $this->assertSame('KUWAGO', $data['artist']);
    }

    public function testCannotUploadWithoutFile(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('POST', '/api/v1/music/upload');

        $this->assertResponseStatusCodeSame(500);
    }

    public function testCannotAccessProtectedEndpointsWithoutAuthentication(): void
    {
        $client = $this->getUnauthenticatedClient();

        // Tester l'accès à la collection sans authentification
        $client->request('GET', '/api/v1/music');
        $this->assertResponseStatusCodeSame(401);

        // Tester l'accès à une musique spécifique sans authentification
        $client->request('GET', '/api/v1/music/b0f05c3b-d289-408e-87e9-274f29305c56');
        $this->assertResponseStatusCodeSame(401);
    }

    public function testCanEditOwnMusic(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('PATCH', '/api/v1/music/b0f05c3b-d289-408e-87e9-274f29305c56', [], [], [
            'CONTENT_TYPE' => 'application/json',
        ], json_encode([
            'name' => 'Chameleon Updated',
            'artist' => 'Hicham Chahidi Updated',
        ]));

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('Content-Type', 'application/json');

        $data = json_decode($client->getResponse()->getContent(), true);

        $this->assertSame('b0f05c3b-d289-408e-87e9-274f29305c56', $data['id']);
        $this->assertSame('Chameleon Updated', $data['name']);
        $this->assertSame('Hicham Chahidi Updated', $data['artist']);
    }

    public function testCanDeleteOwnMusic(): void
    {
        $client = $this->getAuthenticatedClientByEmail('basic-user.test@monochrome.app');

        $client->request('DELETE', '/api/v1/music/b0f05c3b-d289-408e-87e9-274f29305c56');

        $this->assertResponseStatusCodeSame(204);

        // Vérifier que la musique a été supprimée
        $deletedMusic = $this->getRepository(Music::class)->find('b0f05c3b-d289-408e-87e9-274f29305c56');
        $this->assertNull($deletedMusic);
    }
}

