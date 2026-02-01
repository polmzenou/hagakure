<?php

namespace App\Controller\Api;

use App\Entity\Battle;
use App\Entity\Clan;
use App\Entity\Samourai;
use App\Entity\Location;
use App\Repository\BattleRepository;
use App\Repository\ClanRepository;
use App\Repository\SamouraiRepository;
use App\Repository\LocationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/battles', name: 'api_battle_')]
class BattleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private BattleRepository $repository,
        private ClanRepository $clanRepository,
        private SamouraiRepository $samouraiRepository,
        private LocationRepository $locationRepository,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $battles = $this->repository->findAllWithRelations();
        $data = [];

        foreach ($battles as $battle) {
            $data[] = $this->serializeBattle($battle);
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
        $battle = $this->repository->findOneWithRelations($id);

        if (!$battle) {
            return $this->json(['error' => 'Battle not found'], Response::HTTP_NOT_FOUND);
        }

        $response = $this->json($this->serializeBattle($battle));
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['name']) || !isset($data['description']) || !isset($data['date'])) {
                return $this->json([
                    'error' => 'Données invalides',
                    'message' => 'Le nom, la description et la date sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            $battle = new Battle();
            $battle->setName($data['name']);
            $battle->setDescription($data['description']);
            $battle->setSlug($this->slugger->slug($data['name'])->lower());
            
            if (isset($data['date']) && !empty($data['date'])) {
                $battle->setDate(new \DateTime($data['date']));
            }
            if (isset($data['source_url']) && !empty($data['source_url'])) {
                $battle->setSourceUrl($data['source_url']);
            }
            if (isset($data['image']) && !empty($data['image'])) {
                $battle->setImage($data['image']);
            }

            if (isset($data['location_id']) && $data['location_id']) {
                $location = $this->locationRepository->find($data['location_id']);
                if ($location) {
                    $battle->setLocationId($location);
                }
            }

            if (isset($data['winner_clan_id']) && $data['winner_clan_id']) {
                $clan = $this->clanRepository->find($data['winner_clan_id']);
                if ($clan) {
                    $battle->setWinnerClanId($clan);
                }
            }

            if (isset($data['samourai_ids']) && is_array($data['samourai_ids'])) {
                foreach ($data['samourai_ids'] as $samouraiId) {
                    $samourai = $this->samouraiRepository->find($samouraiId);
                    if ($samourai) {
                        $battle->addSamourai($samourai);
                    }
                }
            }

            $battle->setCreatedAt(new \DateTimeImmutable());
            $battle->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($battle);
            $this->entityManager->flush();

            return $this->json($this->serializeBattle($battle), Response::HTTP_CREATED);
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la création',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $battle = $this->repository->find($id);

            if (!$battle) {
                return $this->json(['error' => 'Battle not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['name'])) {
                $battle->setName($data['name']);
                $battle->setSlug($this->slugger->slug($data['name'])->lower());
            }
            if (isset($data['description'])) {
                $battle->setDescription($data['description']);
            }
            if (isset($data['date']) && !empty($data['date'])) {
                $battle->setDate(new \DateTime($data['date']));
            }
            if (isset($data['source_url'])) {
                $battle->setSourceUrl($data['source_url'] ?: null);
            }
            if (isset($data['image'])) {
                $battle->setImage($data['image'] ?: null);
            }

            if (isset($data['location_id'])) {
                if ($data['location_id']) {
                    $location = $this->locationRepository->find($data['location_id']);
                    if ($location) {
                        $battle->setLocationId($location);
                    }
                } else {
                    $battle->setLocationId(null);
                }
            }

            if (isset($data['winner_clan_id'])) {
                if ($data['winner_clan_id']) {
                    $clan = $this->clanRepository->find($data['winner_clan_id']);
                    if ($clan) {
                        $battle->setWinnerClanId($clan);
                    }
                } else {
                    $battle->setWinnerClanId(null);
                }
            }

            if (isset($data['samourai_ids']) && is_array($data['samourai_ids'])) {
                foreach ($battle->getSamourais() as $samourai) {
                    $battle->removeSamourai($samourai);
                }
                foreach ($data['samourai_ids'] as $samouraiId) {
                    $samourai = $this->samouraiRepository->find($samouraiId);
                    if ($samourai) {
                        $battle->addSamourai($samourai);
                    }
                }
            }

            $battle->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return $this->json($this->serializeBattle($battle));
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Erreur lors de la mise à jour',
                'message' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $battle = $this->repository->find($id);

        if (!$battle) {
            return $this->json(['error' => 'Battle not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($battle);
        $this->entityManager->flush();

        return $this->json(['message' => 'Battle deleted successfully']);
    }

    private function serializeBattle(Battle $battle): array
    {
        $samourais = [];
        foreach ($battle->getSamourais() as $samourai) {
            $samourais[] = [
                'id' => $samourai->getId(),
                'name' => $samourai->getName()
            ];
        }

        return [
            'id' => $battle->getId(),
            'name' => $battle->getName(),
            'description' => $battle->getDescription(),
            'date' => $battle->getDate()?->format('Y-m-d'),
            'source_url' => $battle->getSourceUrl(),
            'image' => $battle->getImage(),
            'slug' => $battle->getSlug(),
            'location_id' => $battle->getLocationId() ? [
                'id' => $battle->getLocationId()->getId(),
                'name' => $battle->getLocationId()->getName(),
                'region' => $battle->getLocationId()->getRegion()
            ] : null,
            'winner_clan_id' => $battle->getWinnerClanId() ? [
                'id' => $battle->getWinnerClanId()->getId(),
                'name' => $battle->getWinnerClanId()->getName()
            ] : null,
            'samourais' => $samourais,
            'created_at' => $battle->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $battle->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

