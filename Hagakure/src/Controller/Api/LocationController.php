<?php

namespace App\Controller\Api;

use App\Entity\Location;
use App\Repository\LocationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/locations', name: 'api_location_')]
class LocationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private LocationRepository $repository
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $locations = $this->repository->findAll();
        $data = [];

        foreach ($locations as $location) {
            $data[] = $this->serializeLocation($location);
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $location = $this->repository->find($id);

        if (!$location) {
            return $this->json(['error' => 'Location not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeLocation($location));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $location = new Location();
        $location->setName($data['name'] ?? '');
        $location->setRegion($data['region'] ?? '');
        $location->setLatitude($data['latitude'] ?? '0');
        $location->setLongitude($data['longitude'] ?? '0');
        $location->setType($data['type'] ?? null);
        $location->setDescription($data['description'] ?? null);

        $this->entityManager->persist($location);
        $this->entityManager->flush();

        return $this->json($this->serializeLocation($location), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $location = $this->repository->find($id);

        if (!$location) {
            return $this->json(['error' => 'Location not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $location->setName($data['name']);
        }
        if (isset($data['region'])) {
            $location->setRegion($data['region']);
        }
        if (isset($data['latitude'])) {
            $location->setLatitude($data['latitude']);
        }
        if (isset($data['longitude'])) {
            $location->setLongitude($data['longitude']);
        }
        if (isset($data['type'])) {
            $location->setType($data['type']);
        }
        if (isset($data['description'])) {
            $location->setDescription($data['description']);
        }

        $this->entityManager->flush();

        return $this->json($this->serializeLocation($location));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $location = $this->repository->find($id);

        if (!$location) {
            return $this->json(['error' => 'Location not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($location);
        $this->entityManager->flush();

        return $this->json(['message' => 'Location deleted successfully']);
    }

    private function serializeLocation(Location $location): array
    {
        return [
            'id' => $location->getId(),
            'name' => $location->getName(),
            'region' => $location->getRegion(),
            'latitude' => $location->getLatitude(),
            'longitude' => $location->getLongitude(),
            'type' => $location->getType(),
            'description' => $location->getDescription(),
            'battles_count' => $location->getBattles()->count(),
        ];
    }
}

