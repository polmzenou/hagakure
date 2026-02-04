<?php

namespace App\Controller\Api;

use App\Entity\Weapon;
use App\Repository\WeaponRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/weapons', name: 'api_weapon_')]
class WeaponController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private WeaponRepository $repository,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $weapons = $this->repository->findAll();
        $data = [];

        foreach ($weapons as $weapon) {
            $data[] = $this->serializeWeapon($weapon);
        }

        $response = $this->json($data);
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $weapon = $this->repository->find($id);

        if (!$weapon) {
            return $this->json(['error' => 'Arme non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $response = $this->json($this->serializeWeapon($weapon));
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $weapon = new Weapon();
        $weapon->setName($data['name'] ?? '');
        $weapon->setType($data['type'] ?? '');
        $weapon->setDescription($data['description'] ?? '');
        $weapon->setSlug($this->slugger->slug($data['name'] ?? '')->lower());
        
        if (isset($data['image'])) {
            $weapon->setImage($data['image']);
        }

        $weapon->setCreatedAt(new \DateTimeImmutable());
        $weapon->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($weapon);
        $this->entityManager->flush();

        return $this->json($this->serializeWeapon($weapon), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $weapon = $this->repository->find($id);

        if (!$weapon) {
            return $this->json(['error' => 'Arme non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $weapon->setName($data['name']);
            $weapon->setSlug($this->slugger->slug($data['name'])->lower());
        }
        if (isset($data['type'])) {
            $weapon->setType($data['type']);
        }
        if (isset($data['description'])) {
            $weapon->setDescription($data['description']);
        }
        if (isset($data['image'])) {
            $weapon->setImage($data['image']);
        }

        $weapon->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json($this->serializeWeapon($weapon));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $weapon = $this->repository->find($id);

        if (!$weapon) {
            return $this->json(['error' => 'Arme non trouvée'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($weapon);
        $this->entityManager->flush();

        return $this->json(['message' => 'Arme supprimée avec succès']);
    }

    private function serializeWeapon(Weapon $weapon): array
    {
        return [
            'id' => $weapon->getId(),
            'name' => $weapon->getName(),
            'type' => $weapon->getType(),
            'description' => $weapon->getDescription(),
            'image' => $weapon->getImage(),
            'slug' => $weapon->getSlug(),
            'samourais_count' => $weapon->getSamourais()->count(),
            'created_at' => $weapon->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $weapon->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

