<?php

namespace App\Controller\Api;

use App\Entity\Favorite;
use App\Entity\Samourai;
use App\Entity\Clan;
use App\Entity\Weapon;
use App\Entity\Style;
use App\Entity\Battle;
use App\Entity\Timeline;
use App\Repository\FavoriteRepository;
use App\Repository\SamouraiRepository;
use App\Repository\ClanRepository;
use App\Repository\WeaponRepository;
use App\Repository\StyleRepository;
use App\Repository\BattleRepository;
use App\Repository\TimelineRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/favorites', name: 'api_favorite_')]
#[IsGranted('ROLE_USER')]
class FavoriteController extends AbstractController
{
    public function __construct(
        private FavoriteRepository $favoriteRepository,
        private SamouraiRepository $samouraiRepository,
        private ClanRepository $clanRepository,
        private WeaponRepository $weaponRepository,
        private StyleRepository $styleRepository,
        private BattleRepository $battleRepository,
        private TimelineRepository $timelineRepository,
        private EntityManagerInterface $entityManager
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $favorites = $this->favoriteRepository->findBy(['user_id' => $user]);

        $data = [];
        foreach ($favorites as $favorite) {
            $entityType = $favorite->getEntityType();
            $entityId = $favorite->getEntityId();
            $entity = null;
            $entityData = null;

            switch ($entityType) {
                case 'samourai':
                    $entity = $this->samouraiRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getName(),
                            'type' => 'samourai',
                            'url' => '/samourais/' . $entity->getId(),
                            'image' => $entity->getImage()
                        ];
                    }
                    break;
                case 'clan':
                    $entity = $this->clanRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getName(),
                            'type' => 'clan',
                            'url' => '/clans/' . $entity->getId(),
                            'image' => $entity->getImage()
                        ];
                    }
                    break;
                case 'weapon':
                    $entity = $this->weaponRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getName(),
                            'type' => 'weapon',
                            'url' => '/weapons/' . $entity->getId(),
                            'image' => $entity->getImage()
                        ];
                    }
                    break;
                case 'style':
                    $entity = $this->styleRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getName(),
                            'type' => 'style',
                            'url' => '/styles/' . $entity->getId(),
                            'image' => $entity->getImage()
                        ];
                    }
                    break;
                case 'battle':
                    $entity = $this->battleRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getName(),
                            'type' => 'battle',
                            'url' => '/battles/' . $entity->getId(),
                            'image' => $entity->getImage()
                        ];
                    }
                    break;
                case 'timeline':
                    $entity = $this->timelineRepository->find($entityId);
                    if ($entity) {
                        $entityData = [
                            'id' => $entity->getId(),
                            'name' => $entity->getTitle(),
                            'type' => 'timeline',
                            'url' => '/timeline',
                            'year' => $entity->getYear(),
                            'date' => $entity->getDate()?->format('Y-m-d'),
                            'description' => $entity->getDescription(),
                            'event_type' => $entity->getType()
                        ];
                    }
                    break;
            }

            if ($entityData) {
                $data[] = [
                    'id' => $favorite->getId(),
                    'entity' => $entityData,
                    'created_at' => $favorite->getCreatedAt()->format('Y-m-d H:i:s')
                ];
            }
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['entity_type']) || !isset($data['entity_id'])) {
            return $this->json(['message' => 'entity_type et entity_id requis'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si le favori existe déjà
        $existingFavorite = $this->favoriteRepository->findOneBy([
            'user_id' => $user,
            'entity_type' => $data['entity_type'],
            'entity_id' => $data['entity_id']
        ]);

        if ($existingFavorite) {
            return $this->json(['message' => 'Déjà en favoris', 'favorite_id' => $existingFavorite->getId()], Response::HTTP_CONFLICT);
        }

        // Créer le nouveau favori
        $favorite = new Favorite();
        $favorite->setUserId($user);
        $favorite->setEntityType($data['entity_type']);
        $favorite->setEntityId($data['entity_id']);
        $favorite->setCreatedAt(new \DateTimeImmutable());
        $favorite->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($favorite);
        $this->entityManager->flush();

        return $this->json([
            'message' => 'Ajouté aux favoris',
            'favorite_id' => $favorite->getId()
        ], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $favorite = $this->favoriteRepository->find($id);

        if (!$favorite) {
            return $this->json(['message' => 'Favori non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // Vérifier que le favori appartient à l'utilisateur
        if ($favorite->getUserId() !== $user) {
            return $this->json(['message' => 'Non autorisé'], Response::HTTP_FORBIDDEN);
        }

        $this->entityManager->remove($favorite);
        $this->entityManager->flush();

        return $this->json(['message' => 'Retiré des favoris']);
    }

    #[Route('/toggle', name: 'toggle', methods: ['POST'])]
    public function toggle(Request $request): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $data = json_decode($request->getContent(), true);

        if (!isset($data['entity_type']) || !isset($data['entity_id'])) {
            return $this->json(['message' => 'entity_type et entity_id requis'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier si le favori existe déjà
        $existingFavorite = $this->favoriteRepository->findOneBy([
            'user_id' => $user,
            'entity_type' => $data['entity_type'],
            'entity_id' => $data['entity_id']
        ]);

        if ($existingFavorite) {
            // Supprimer le favori
            $this->entityManager->remove($existingFavorite);
            $this->entityManager->flush();
            return $this->json(['message' => 'Retiré des favoris', 'is_favorite' => false]);
        } else {
            // Créer le favori
            $favorite = new Favorite();
            $favorite->setUserId($user);
            $favorite->setEntityType($data['entity_type']);
            $favorite->setEntityId($data['entity_id']);
            $favorite->setCreatedAt(new \DateTimeImmutable());
            $favorite->setUpdatedAt(new \DateTimeImmutable());

            $this->entityManager->persist($favorite);
            $this->entityManager->flush();
            return $this->json(['message' => 'Ajouté aux favoris', 'is_favorite' => true, 'favorite_id' => $favorite->getId()]);
        }
    }

    #[Route('/check', name: 'check', methods: ['GET'])]
    public function check(Request $request): JsonResponse
    {
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $entityType = $request->query->get('entity_type');
        $entityId = $request->query->getInt('entity_id');

        if (!$entityType || !$entityId) {
            return $this->json(['message' => 'entity_type et entity_id requis'], Response::HTTP_BAD_REQUEST);
        }

        $favorite = $this->favoriteRepository->findOneBy([
            'user_id' => $user,
            'entity_type' => $entityType,
            'entity_id' => $entityId
        ]);

        return $this->json([
            'is_favorite' => $favorite !== null,
            'favorite_id' => $favorite?->getId()
        ]);
    }
}

