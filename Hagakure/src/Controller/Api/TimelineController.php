<?php

namespace App\Controller\Api;

use App\Repository\TimelineRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/timeline')]
class TimelineController extends AbstractController
{
    /**
     * Récupère tous les événements de la timeline triés par date
     */
    #[Route('', name: 'api_timeline_list', methods: ['GET'])]
    public function list(TimelineRepository $timelineRepository): JsonResponse
    {
        // Récupérer tous les événements triés par date
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

        return $this->json($data);
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

        return $this->json($data);
    }
}

