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

#[Route('/api/users', name: 'api_user_')]
class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserRepository $repository,
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $users = $this->repository->findBy([], ['id' => 'ASC']);
        $data = array_map(fn (User $u) => $this->serializeUser($u), $users);
        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        return $this->json($this->serializeUser($user));
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['email']) && is_string($data['email'])) {
            $existing = $this->repository->findOneBy(['email' => $data['email']]);
            if ($existing && $existing->getId() !== $user->getId()) {
                return $this->json(['message' => 'Cet email est déjà utilisé'], Response::HTTP_CONFLICT);
            }
            $user->setEmail(trim($data['email']));
        }

        if (isset($data['roles']) && is_array($data['roles'])) {
            $roles = array_values(array_filter($data['roles'], fn ($r) => $r === 'ROLE_USER' || $r === 'ROLE_ADMIN'));
            if (!in_array('ROLE_USER', $roles, true)) {
                $roles[] = 'ROLE_USER';
            }
            $user->setRoles(array_unique($roles));
        }

        if (isset($data['password']) && is_string($data['password']) && $data['password'] !== '') {
            $user->setPassword($this->passwordHasher->hashPassword($user, $data['password']));
        }

        $this->entityManager->flush();
        return $this->json($this->serializeUser($user));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $user = $this->repository->find($id);
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
        $this->entityManager->remove($user);
        $this->entityManager->flush();
        return $this->json(['message' => 'Utilisateur supprimé']);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ];
    }
}
