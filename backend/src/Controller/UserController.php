<?php

namespace App\Controller;

use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Dto\ValidPasswordRecoveryPayloadDto;
use Nelmio\ApiDocBundle\Attribute\Security;
use Doctrine\ORM\EntityManagerInterface;
use Nelmio\ApiDocBundle\Attribute\Model;
use App\Service\ExportUserDataService;
use App\Dto\ChangePasswordPayloadDto;
use App\Repository\UserRepository;
use Symfony\Component\Mime\Email;
use OpenApi\Attributes as OA;
use App\Entity\User;

#[OA\Tag(name: 'User')]
#[Route('/api/v1/user')]
final class UserController extends AbstractController
{
    #[OA\Response(
        response: 200,
        description: 'Get the current logged user information',
        content: new Model(type: User::class, groups: ['user:get-self'])
    )]
    #[Route('/me', name: 'api.v1.user.me', methods: ['GET'])]
    public function getSelf(
        NormalizerInterface     $normalizer,
    ): JsonResponse
    {
        // Retourner les informations de l'utilisateur
        return $this->json($normalizer->normalize($this->getUser(), null, ['groups' => ['user:get-self']]));
    }




    #[OA\RequestBody(
        description: 'User registration data',
        content: new Model(type: User::class, groups: ['user:register'])
    )]
    #[OA\Response(
        response: 201,
        description: 'User registered successfully',
        content: new Model(type: User::class, groups: ['user:get-self'])
    )]
    #[Security(name: null)]
    #[Route('/register', name: 'api.v1.user.register', methods: ['POST'])]
    public function register(
        NormalizerInterface             $normalizer,
        Request                         $request,
        SerializerInterface             $serializer,
        UserPasswordHasherInterface     $userPasswordHasher,
        EntityManagerInterface          $entityManager,
    ): JsonResponse
    {
        /** @var User $input */
        $input = $serializer->deserialize(
            $request->getContent(),
            User::class,
            'json',
            ['groups' => ['user:register']]
        );

        $user = new User();
        $user->setName($input->getName());
        $user->setEmail($input->getEmail());
        $user->setPassword($userPasswordHasher->hashPassword($user, $input->getPassword()));
        $user->setRoles(['ROLE_USER']);

        $entityManager->persist($user);
        $entityManager->flush();

        // Retourner les informations de l'utilisateur
        return $this->json($normalizer->normalize($user, null, ['groups' => ['user:get-self']]), 201);
    }




    #[OA\RequestBody(
        description: 'User change password data',
        content: new Model(type: ChangePasswordPayloadDto::class)
    )]
    #[OA\Response(
        response: 201,
        description: 'User password changed successfully',
        content: new Model(type: User::class, groups: ['user:get-self'])
    )]
    #[Route('/change-password', name: 'api.v1.user.change-password', methods: ['POST'])]
    public function changePassword(
        NormalizerInterface                                     $normalizer,
        UserRepository                                          $userRepository,
        UserPasswordHasherInterface                             $userPasswordHasher,
        EntityManagerInterface                                  $entityManager,
        #[MapRequestPayload('json')] ChangePasswordPayloadDto   $input,
    ): JsonResponse
    {
        $user = $userRepository->findOneBy(['email' => $this->getUser()->getUserIdentifier()]);
        // Vérifier si l'utilisateur existe
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        if ($userPasswordHasher->isPasswordValid($user, $input->password)) {
            $user->setPassword($userPasswordHasher->hashPassword($user, $input->newPassword));
            $entityManager->persist($user);
            $entityManager->flush();

            // Retourner les informations de l'utilisateur
            return $this->json($normalizer->normalize($user, null, ['groups' => ['user:get-self']]), 201);
        }

        // Si le mot de passe actuel est incorrect, retourner une erreur
        return $this->json(['error' => 'Invalid password'], Response::HTTP_BAD_REQUEST);
    }




    #[OA\RequestBody(
        description: 'User password recovery data',
        content: new Model(type: User::class, groups: ['user:request-password-recovery'])
    )]
    #[OA\Response(
        response: 201,
        description: 'User password recovery code sent successfully',
    )]
    #[Security(name: null)]
    #[Route('/request-password-recovery', name: 'api.v1.user.request-password-recovery', methods: ['POST'])]
    public function requestPasswordRecovery(
        Request                     $request,
        SerializerInterface         $serializer,
        UserRepository              $userRepository,
        EntityManagerInterface      $entityManager,
        MailerInterface             $mailer
    ): JsonResponse
    {
        /** @var User $input */
        $input = $serializer->deserialize(
            $request->getContent(),
            User::class,
            'json',
            ['groups' => ['user:request-password-recovery']]
        );
        $email = $input->getEmail();

        // check if the user exists
        /** @var User $user */
        $user = $userRepository->findOneBy(['email' => $email]);

        // limit the number of requests to 5 per hour
        if ($user && $user->getRecoveryCodeExpiration() instanceof \DateTimeImmutable) {
            $nowDt = new \DateTimeImmutable('+1 hour');
            $lastRecoveryCode = $user->getRecoveryCodeExpiration();
            // get difference between now and last recovery code
            $diff = $lastRecoveryCode->diff($nowDt);
            $diffInMinutes = ($diff->days * 24 * 60) + ($diff->h * 60) + $diff->i;
            if ($diffInMinutes < 10) {
                return $this->json(['error' => 'You have already requested a password recovery code. Please wait '. 10 - $diffInMinutes .' minutes before requesting another one.'], Response::HTTP_BAD_REQUEST);
            }
        }
        // generate a recovery code (5 number) and save it to the user entity
        $user->setRecoveryCode(random_int(10000, 99999));
        // set the expiration date to 1 hour from now
        $user->setRecoveryCodeExpiration(new \DateTimeImmutable('+1 hour'));
        $entityManager->persist($user);
        $entityManager->flush();

        // send email to user with a code to reset password
        $email = (new Email())
            ->from('account-recovery@monochrome.wav')
            ->to($user->getEmail())
            ->subject('Code for account recovery - Monochrome')
            ->text('Hello ' . $user->getName() . ', your code for account recovery is: ' . $user->getRecoveryCode() . '. Please use it to reset your password.');
        $mailer->send($email);

        // Retourner les informations de l'utilisateur
        return $this->json([
            'message' => 'A password recovery code has been sent to your email address.',
        ], Response::HTTP_CREATED);
    }




    #[OA\RequestBody(
        description: 'User password recovery validation data',
        content: new Model(type: ValidPasswordRecoveryPayloadDto::class)
    )]
    #[OA\Response(
        response: 201,
        description: 'User password changed successfully',
    )]
    #[Security(name: null)]
    #[Route('/valid-password-recovery', name: 'api.v1.user.valid-password-recovery', methods: ['POST'])]
    public function validPasswordRecovery(
        UserRepository                                                  $userRepository,
        UserPasswordHasherInterface                                     $userPasswordHasher,
        EntityManagerInterface                                          $entityManager,
        #[MapRequestPayload('json')] ValidPasswordRecoveryPayloadDto    $input,
    ): JsonResponse
    {
        $user = $userRepository->findOneBy(['email' => $input->email]);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        if ($user->getRecoveryCodeExpiration() < new \DateTimeImmutable()) {
            return $this->json(['error' => 'Code expired'], Response::HTTP_BAD_REQUEST);
        }

        if ($user->getRecoveryCode() !== $input->code) {
            return $this->json(['error' => 'Invalid code'], Response::HTTP_BAD_REQUEST);
        }

        // generate a new password and save it to the user entity
        $user->setPassword($userPasswordHasher->hashPassword($user, $input->password));
        $user->setRecoveryCode(null);
        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json([
            'message' => 'Password changed successfully.',
        ], Response::HTTP_CREATED);
    }

    #[OA\Response(
        response: 200,
        description: 'Export des données personnelles de l\'utilisateur (RGPD) envoyé par mail',
    )]
    #[Route('/export-data', name: 'api.v1.user.export-data', methods: ['GET'])]
    public function exportUserData(
        ExportUserDataService $exportUserDataService,
        MailerInterface $mailer
    ): Response {
        /** @var User $user */
        $user = $this->getUser();
        $json = $exportUserDataService->exportUserData($user);
        $email = (new Email())
            ->from('account-export@monochrome.wav')
            ->to($user->getEmail())
            ->subject('Export de vos données personnelles - Monochrome')
            ->text('Bonjour ' . $user->getName() . ",\n\nVous trouverez en pièce jointe l\'export de vos données personnelles au format JSON, conformément au RGPD.\n\nCeci est un envoi automatique, merci de ne pas répondre.")
            ->attach($json, 'export_rgpd_user.json', 'application/json');
        try {
            $mailer->send($email);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to send email'], Response::HTTP_BAD_REQUEST);
        }
        return new Response(null, Response::HTTP_OK);
    }

    #[OA\Response(
        response: 204,
        description: 'User deleted successfully',
    )]
    #[Route('', name: 'api.v1.user.delete', methods: ['DELETE'])]
    public function delete(
        EntityManagerInterface      $entityManager,
    ): JsonResponse
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($user);
        $entityManager->flush();

        return new JsonResponse(null, Response::HTTP_NO_CONTENT);
    }
}
