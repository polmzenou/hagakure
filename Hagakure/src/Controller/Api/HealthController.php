<?php

namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

/**
 * Endpoint léger (sans BDD) appelé par Render et par le moniteur d'uptime
 * pour garder le service éveillé.
 */
class HealthController extends AbstractController
{
    #[Route('/api/health', name: 'api_health', methods: ['GET', 'HEAD'])]
    public function __invoke(): JsonResponse
    {
        return $this->json(['status' => 'ok']);
    }
}
