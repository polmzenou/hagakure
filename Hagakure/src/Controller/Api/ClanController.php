<?php

namespace App\Controller\Api;

use App\Entity\Clan;
use App\Repository\ClanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/clans', name: 'api_clan_')]
class ClanController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ClanRepository $repository,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $clans = $this->repository->findAllWithRelations();
        $data = [];

        foreach ($clans as $clan) {
            $data[] = $this->serializeClan($clan);
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
        $clan = $this->repository->findOneWithRelations($id);

        if (!$clan) {
            return $this->json(['error' => 'Clan not found'], Response::HTTP_NOT_FOUND);
        }

        $response = $this->json($this->serializeClan($clan));
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $clan = new Clan();
        $clan->setName($data['name'] ?? '');
        $clan->setDescription($data['description'] ?? '');
        $clan->setSlug($this->slugger->slug($data['name'] ?? '')->lower());
        
        if (isset($data['founded_date']) && $data['founded_date'] !== '') {
            $clan->setFoundedDate(new \DateTime($data['founded_date']));
        } else {
            $clan->setFoundedDate(null);
        }
        if (isset($data['disbanded_date']) && $data['disbanded_date'] !== '') {
            $clan->setDisbandedDate(new \DateTime($data['disbanded_date']));
        } else {
            $clan->setDisbandedDate(null);
        }
        if (isset($data['image'])) {
            $clan->setImage($data['image']);
        }

        $clan->setCreatedAt(new \DateTimeImmutable());
        $clan->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($clan);
        $this->entityManager->flush();

        return $this->json($this->serializeClan($clan), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $clan = $this->repository->find($id);

        if (!$clan) {
            return $this->json(['error' => 'Clan not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $clan->setName($data['name']);
            $clan->setSlug($this->slugger->slug($data['name'])->lower());
        }
        if (isset($data['description'])) {
            $clan->setDescription($data['description']);
        }
        if (array_key_exists('founded_date', $data)) {
            $clan->setFoundedDate(($data['founded_date'] !== '' && $data['founded_date'] !== null) ? new \DateTime($data['founded_date']) : null);
        }
        if (array_key_exists('disbanded_date', $data)) {
            $clan->setDisbandedDate(($data['disbanded_date'] !== '' && $data['disbanded_date'] !== null) ? new \DateTime($data['disbanded_date']) : null);
        }
        if (isset($data['image'])) {
            $clan->setImage($data['image']);
        }

        $clan->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json($this->serializeClan($clan));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $clan = $this->repository->find($id);

        if (!$clan) {
            return $this->json(['error' => 'Clan not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($clan);
        $this->entityManager->flush();

        return $this->json(['message' => 'Clan deleted successfully']);
    }

    private function serializeClan(Clan $clan): array
    {
        return [
            'id' => $clan->getId(),
            'name' => $clan->getName(),
            'description' => $clan->getDescription(),
            'founded_date' => $clan->getFoundedDate()?->format('Y-m-d'),
            'disbanded_date' => $clan->getDisbandedDate()?->format('Y-m-d'),
            'image' => $clan->getImage(),
            'slug' => $clan->getSlug(),
            'leader' => $clan->getLeaderId() ? [
                'id' => $clan->getLeaderId()->getId(),
                'name' => $clan->getLeaderId()->getName()
            ] : null,
            'samourais_count' => $clan->getSamourais()->count(),
            'created_at' => $clan->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $clan->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

