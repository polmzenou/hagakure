<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/profile', name: 'api_profile_')]
#[IsGranted('ROLE_USER')]
class ProfileController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $userRepository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('', name: 'get', methods: ['GET'])]
    public function getProfile(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => explode('@', $user->getEmail())[0],
            'roles' => $user->getRoles()
        ]);
    }

    #[Route('', name: 'update', methods: ['PUT'])]
    public function updateProfile(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'])) {
            return $this->json(['message' => 'Email requis'], Response::HTTP_BAD_REQUEST);
        }

        $existingUser = $this->userRepository->findOneBy(['email' => $data['email']]);
        if ($existingUser && $existingUser->getId() !== $user->getId()) {
            return $this->json(['message' => 'Cet email est déjà utilisé'], Response::HTTP_CONFLICT);
        }

        $user->setEmail($data['email']);
        $this->entityManager->flush();

        return $this->json([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'username' => explode('@', $user->getEmail())[0],
            'roles' => $user->getRoles(),
            'message' => 'Profil mis à jour avec succès'
        ]);
    }

    #[Route('/password', name: 'change_password', methods: ['PUT'])]
    public function changePassword(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['currentPassword']) || !isset($data['newPassword'])) {
            return $this->json(['message' => 'Mot de passe actuel et nouveau mot de passe requis'], Response::HTTP_BAD_REQUEST);
        }

        if (!$this->passwordHasher->isPasswordValid($user, $data['currentPassword'])) {
            return $this->json(['message' => 'Mot de passe actuel incorrect'], Response::HTTP_UNAUTHORIZED);
        }

        if (strlen($data['newPassword']) < 6) {
            return $this->json(['message' => 'Le nouveau mot de passe doit contenir au moins 6 caractères'], Response::HTTP_BAD_REQUEST);
        }

        $hashedPassword = $this->passwordHasher->hashPassword($user, $data['newPassword']);
        $user->setPassword($hashedPassword);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Mot de passe modifié avec succès'
        ]);
    }
}

