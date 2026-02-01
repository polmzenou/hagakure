<?php

namespace App\Controller\Api;

use App\Entity\Samourai;
use App\Entity\Clan;
use App\Entity\Weapon;
use App\Entity\Style;
use App\Repository\SamouraiRepository;
use App\Repository\ClanRepository;
use App\Repository\WeaponRepository;
use App\Repository\StyleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/samourais', name: 'api_samourai_')]
class SamouraiController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SamouraiRepository $repository,
        private ClanRepository $clanRepository,
        private WeaponRepository $weaponRepository,
        private StyleRepository $styleRepository,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $samourais = $this->repository->findAllWithRelations();
        $data = [];

        foreach ($samourais as $samourai) {
            $data[] = $this->serializeSamourai($samourai);
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
        $samourai = $this->repository->findOneWithRelations($id);

        if (!$samourai) {
            return $this->json(['error' => 'Samourai not found'], Response::HTTP_NOT_FOUND);
        }

        $response = $this->json($this->serializeSamourai($samourai));
        $response->setMaxAge(3600);
        $response->setSharedMaxAge(3600);
        $response->headers->addCacheControlDirective('must-revalidate', true);
        
        return $response;
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        try {
            $content = $request->getContent();
            error_log('Content length: ' . strlen($content));
            
            $data = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                error_log('JSON decode error: ' . json_last_error_msg());
                return $this->json([
                    'error' => 'Erreur JSON',
                    'message' => 'Impossible de décoder les données JSON: ' . json_last_error_msg()
                ], Response::HTTP_BAD_REQUEST);
            }

            if (!$data || !isset($data['name']) || !isset($data['description'])) {
                return $this->json([
                    'error' => 'Données invalides',
                    'message' => 'Le nom et la description sont requis'
                ], Response::HTTP_BAD_REQUEST);
            }

            $samourai = new Samourai();
            $samourai->setName($data['name']);
            $samourai->setDescription($data['description']);
            $samourai->setSlug($this->slugger->slug($data['name'])->lower());
            
            if (isset($data['birth_date']) && !empty($data['birth_date'])) {
                $samourai->setBirthDate(new \DateTime($data['birth_date']));
            }
            if (isset($data['death_date']) && !empty($data['death_date'])) {
                $samourai->setDeathDate(new \DateTime($data['death_date']));
            }
            if (isset($data['source_url']) && !empty($data['source_url'])) {
                $samourai->setSourceUrl($data['source_url']);
            }
            if (isset($data['image']) && !empty($data['image'])) {
                $samourai->setImage($data['image']);
            }

            if (isset($data['clan_id']) && $data['clan_id']) {
                $clan = $this->clanRepository->find($data['clan_id']);
                if ($clan) {
                    $samourai->setClanId($clan);
                }
            }

            // Gestion des armes
            if (isset($data['weapon_ids']) && is_array($data['weapon_ids'])) {
                foreach ($data['weapon_ids'] as $weaponId) {
                    $weapon = $this->weaponRepository->find($weaponId);
                    if ($weapon) {
                        $samourai->addWeapon($weapon);
                    }
                }
            }

            if (isset($data['style_ids']) && is_array($data['style_ids'])) {
                foreach ($data['style_ids'] as $styleId) {
                    $style = $this->styleRepository->find($styleId);
                    if ($style) {
                        $samourai->addStyleId($style);
                    }
                }
            }

            $samourai->setCreatedAt(new \DateTimeImmutable());
            $samourai->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($samourai);
            $this->entityManager->flush();

            return $this->json($this->serializeSamourai($samourai), Response::HTTP_CREATED);
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
            $samourai = $this->repository->find($id);

            if (!$samourai) {
                return $this->json(['error' => 'Samourai not found'], Response::HTTP_NOT_FOUND);
            }

            $data = json_decode($request->getContent(), true);

            if (isset($data['name'])) {
                $samourai->setName($data['name']);
                $samourai->setSlug($this->slugger->slug($data['name'])->lower());
            }
            if (isset($data['description'])) {
                $samourai->setDescription($data['description']);
            }
            if (isset($data['birth_date']) && !empty($data['birth_date'])) {
                $samourai->setBirthDate(new \DateTime($data['birth_date']));
            }
            if (isset($data['death_date']) && !empty($data['death_date'])) {
                $samourai->setDeathDate(new \DateTime($data['death_date']));
            }
            if (isset($data['source_url'])) {
                $samourai->setSourceUrl($data['source_url'] ?: null);
            }
            if (isset($data['image'])) {
                $samourai->setImage($data['image'] ?: null);
            }

            if (isset($data['clan_id'])) {
                if ($data['clan_id']) {
                    $clan = $this->clanRepository->find($data['clan_id']);
                    if ($clan) {
                        $samourai->setClanId($clan);
                    }
                } else {
                    $samourai->setClanId(null);
                }
            }

            if (isset($data['weapon_ids']) && is_array($data['weapon_ids'])) {
                foreach ($samourai->getWeapon() as $weapon) {
                    $samourai->removeWeapon($weapon);
                }
                foreach ($data['weapon_ids'] as $weaponId) {
                    $weapon = $this->weaponRepository->find($weaponId);
                    if ($weapon) {
                        $samourai->addWeapon($weapon);
                    }
                }
            }

            if (isset($data['style_ids']) && is_array($data['style_ids'])) {
                foreach ($samourai->getStyleId() as $style) {
                    $samourai->removeStyleId($style);
                }
                foreach ($data['style_ids'] as $styleId) {
                    $style = $this->styleRepository->find($styleId);
                    if ($style) {
                        $samourai->addStyleId($style);
                    }
                }
            }

            $samourai->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->flush();

            return $this->json($this->serializeSamourai($samourai));
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
        $samourai = $this->repository->find($id);

        if (!$samourai) {
            return $this->json(['error' => 'Samourai not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($samourai);
        $this->entityManager->flush();

        return $this->json(['message' => 'Samourai deleted successfully']);
    }

    private function serializeSamourai(Samourai $samourai): array
    {
        $weapons = [];
        foreach ($samourai->getWeapon() as $weapon) {
            $weapons[] = [
                'id' => $weapon->getId(),
                'name' => $weapon->getName()
            ];
        }

        $styles = [];
        foreach ($samourai->getStyleId() as $style) {
            $styles[] = [
                'id' => $style->getId(),
                'name' => $style->getName()
            ];
        }

        return [
            'id' => $samourai->getId(),
            'name' => $samourai->getName(),
            'description' => $samourai->getDescription(),
            'birth_date' => $samourai->getBirthDate()?->format('Y-m-d'),
            'death_date' => $samourai->getDeathDate()?->format('Y-m-d'),
            'source_url' => $samourai->getSourceUrl(),
            'image' => $samourai->getImage(),
            'slug' => $samourai->getSlug(),
            'clan' => $samourai->getClanId() ? [
                'id' => $samourai->getClanId()->getId(),
                'name' => $samourai->getClanId()->getName()
            ] : null,
            'weapon' => $weapons,
            'style_id' => $styles,
            'created_at' => $samourai->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $samourai->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

