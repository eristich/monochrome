<?php

namespace App\DataFixtures;

use Doctrine\Bundle\FixturesBundle\FixtureGroupInterface;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use App\Factory\UserFactory;
use App\Entity\Music;
use App\Entity\User;
use Symfony\Component\Uid\Uuid;

class TestFixtures extends Fixture implements FixtureGroupInterface
{
    public function __construct(private UserFactory $userFactory)
    {}

    public function load(ObjectManager $manager): void
    {
        // music fixtures
        $musicMetadata = [
            'Chameleon' => [
                'id' => 'b0f05c3b-d289-408e-87e9-274f29305c56',
                'artist' => 'Hicham Chahidi',
                'originalFilename' => 'Chameleon.mp3',
                'ownerId' => '0197bc57-124c-747d-b7a3-20eec51be0b2',
            ],
            'NIGHT' => [
                'id' => '78f02a1b-dce4-415c-be66-2151afd3fa9b',
                'artist' => 'KOSMORIDER',
                'originalFilename' => 'Kosmorider-Night.mp3',
                'ownerId' => '0197bc57-124c-747d-b7a3-20eec51be0b2',
            ]
        ];

        $userList = [];
        $userList[] = $this->userFactory->createBasicUser(
            'basic-user.test@monochrome.app',
            'John Doe',
            'root',
            '0197bc57-124c-747d-b7a3-20eec51be0b2'
        );

        $userList[] = $this->userFactory->createAdmin(
            'admin-user.test@monochrome.app',
            'The Administrator',
            'root',
            '0197bc57-124c-747d-b7a3-20eec5889ed4'
        );

        $userList[] = $this->userFactory->createModerator(
            'moderator-user.test@monochrome.app',
            'The Moderator',
            'root',
            '0197bc57-124c-747d-b7a3-20eec62958df'
        );

        $userList[] = $this->userFactory->createBannedUser(
            'banned-user.test@monochrome.app',
            'Banned User',
            'root',
            '0197bc57-124c-747d-b7a3-20eec6803dd9'
        );

        $userList[] = $this->userFactory->createDisallowedToUploadUser(
            'noupload-user.test@monochrome.app',
            'Uploader User',
            'root',
            '0197bc57-124c-747d-b7a3-20eec7662887'
        );

        foreach ($userList as $user) {
            $manager->persist($user);
        }

        foreach ($musicMetadata as $name => $metadata) {
            $music = new Music();
            $music->setName($name)
                ->setArtist($metadata['artist'])
                ->setOriginalFilename($metadata['originalFilename'])
                ->setOwner($manager->getRepository(User::class)->find(Uuid::fromString('0197bc57-124c-747d-b7a3-20eec51be0b2')))
                ->setBinaryFile(file_get_contents(dirname(__DIR__, 2) . '/music-fixtures/' . $metadata['originalFilename']));
            $manager->persist($music);
        }

        $manager->flush();
    }

    public static function getGroups(): array
    {
        return ['test'];
    }
}
