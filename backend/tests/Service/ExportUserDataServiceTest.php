<?php

namespace App\Tests\Service;

use App\Service\ExportUserDataService;
use App\Entity\User;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Uid\Uuid;

class ExportUserDataServiceTest extends TestCase
{
    public function testExportUserDataReturnsExpectedJson()
    {
        $user = $this->createMock(User::class);
        $user->method('getId')->willReturn(Uuid::fromString('0197bc57-124c-747d-b7a3-20eec51be0b2'));

        $userRepository = $this->createMock(UserRepository::class);
        $userRepository->method('find')->willReturn($user);

        $normalizer = $this->createMock(NormalizerInterface::class);
        $normalizer->method('normalize')->willReturn([
            'id' => 'fake-id',
            'name' => 'John Doe',
            'email' => 'john@doe.com',
            'music' => [
                ['id' => 'music1', 'name' => 'Song 1'],
                ['id' => 'music2', 'name' => 'Song 2'],
            ],
        ]);

        $serializer = $this->createMock(SerializerInterface::class);
        $serializer->method('serialize')->willReturnCallback(function ($data, $format) {
            return json_encode($data);
        });

        $service = new ExportUserDataService($serializer, $userRepository, $normalizer);
        $json = $service->exportUserData($user);
        $data = json_decode($json, true);

        $this->assertEquals('fake-id', $data['id']);
        $this->assertEquals('John Doe', $data['name']);
        $this->assertEquals('john@doe.com', $data['email']);
        $this->assertArrayHasKey('music', $data);
        $this->assertCount(2, $data['music']);
        $this->assertArrayHasKey('exported_at', $data);
    }
}
