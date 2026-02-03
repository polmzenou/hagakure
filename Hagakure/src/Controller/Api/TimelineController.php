<?php

namespace App\Controller\Api;

use App\Entity\Timeline;
use App\Repository\TimelineRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/timeline')]
class TimelineController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}
    /**
     * Récupère tous les événements de la timeline triés par date
     */
    #[Route('', name: 'api_timeline_list', methods: ['GET'])]
    public function list(TimelineRepository $timelineRepository): JsonResponse
    {
        $timelines = $timelineRepository->findBy([], ['date' => 'ASC']);

        $data = [];
        foreach ($timelines as $timeline) {
            $data[] = [
                'id' => $timeline->getId(),
                'year' => $timeline->getYear(),
                'date' => $timeline->getDate()?->format('Y-m-d'),
                'title' => $timeline->getTitle(),
                'type' => $timeline->getType(),
                'description' => $timeline->getDescription(),
                'battle_id' => $timeline->getBattleId()?->getId(),
            ];
        }

        $response = $this->json($data);
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    /**
     * Récupère un événement spécifique de la timeline
     */
    #[Route('/{id}', name: 'api_timeline_show', methods: ['GET'])]
    public function show(int $id, TimelineRepository $timelineRepository): JsonResponse
    {
        $timeline = $timelineRepository->find($id);

        if (!$timeline) {
            return $this->json(['error' => 'Timeline event not found'], 404);
        }

        $data = [
            'id' => $timeline->getId(),
            'year' => $timeline->getYear(),
            'date' => $timeline->getDate()?->format('Y-m-d'),
            'title' => $timeline->getTitle(),
            'type' => $timeline->getType(),
            'description' => $timeline->getDescription(),
            'battle_id' => $timeline->getBattleId()?->getId(),
            'created_at' => $timeline->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $timeline->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];

        $response = $this->json($data);
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    /**
     * Crée un nouvel événement dans la timeline
     */
    #[Route('', name: 'api_timeline_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $timeline = new Timeline();
        $timeline->setTitle($data['title'] ?? '');
        $timeline->setType($data['type'] ?? 'politique');
        $timeline->setDescription($data['description'] ?? '');
        
        // Gérer la date
        if (!empty($data['date'])) {
            $date = new \DateTime($data['date']);
            $timeline->setDate($date);
            $timeline->setYear((int) $date->format('Y'));
        } else {
            $timeline->setDate(new \DateTime());
            $timeline->setYear((int) date('Y'));
        }

        $now = new \DateTimeImmutable();
        $timeline->setCreatedAt($now);
        $timeline->setUpdatedAt($now);

        $this->entityManager->persist($timeline);
        $this->entityManager->flush();

        return $this->json([
            'id' => $timeline->getId(),
            'year' => $timeline->getYear(),
            'date' => $timeline->getDate()?->format('Y-m-d'),
            'title' => $timeline->getTitle(),
            'type' => $timeline->getType(),
            'description' => $timeline->getDescription(),
        ], Response::HTTP_CREATED);
    }

    /**
     * Met à jour un événement de la timeline
     */
    #[Route('/{id}', name: 'api_timeline_update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request, TimelineRepository $timelineRepository): JsonResponse
    {
        $timeline = $timelineRepository->find($id);

        if (!$timeline) {
            return $this->json(['error' => 'Timeline event not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $timeline->setTitle($data['title']);
        }
        if (isset($data['type'])) {
            $timeline->setType($data['type']);
        }
        if (isset($data['description'])) {
            $timeline->setDescription($data['description']);
        }
        if (!empty($data['date'])) {
            $date = new \DateTime($data['date']);
            $timeline->setDate($date);
            $timeline->setYear((int) $date->format('Y'));
        }

        $timeline->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json([
            'id' => $timeline->getId(),
            'year' => $timeline->getYear(),
            'date' => $timeline->getDate()?->format('Y-m-d'),
            'title' => $timeline->getTitle(),
            'type' => $timeline->getType(),
            'description' => $timeline->getDescription(),
        ]);
    }

    /**
     * Supprime un événement de la timeline
     */
    #[Route('/{id}', name: 'api_timeline_delete', methods: ['DELETE'])]
    public function delete(int $id, TimelineRepository $timelineRepository): JsonResponse
    {
        $timeline = $timelineRepository->find($id);

        if (!$timeline) {
            return $this->json(['error' => 'Timeline event not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($timeline);
        $this->entityManager->flush();

        return $this->json(['message' => 'Timeline event deleted successfully']);
    }
}

