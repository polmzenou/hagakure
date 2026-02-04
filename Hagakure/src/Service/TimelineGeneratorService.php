<?php

namespace App\Service;

use App\Data\HistoricalEventsData;
use App\Entity\Battle;
use App\Entity\Samourai;
use App\Entity\Timeline;
use App\Entity\TimelineEntities;
use App\Repository\BattleRepository;
use App\Repository\SamouraiRepository;
use App\Repository\TimelineRepository;
use App\Repository\TimelineEntitiesRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

/**
 * Service responsable de la génération et synchronisation automatique
 * des entrées Timeline et TimelineEntities à partir des Battles et Samourais
 */
class TimelineGeneratorService
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private BattleRepository $battleRepository,
        private SamouraiRepository $samouraiRepository,
        private TimelineRepository $timelineRepository,
        private TimelineEntitiesRepository $timelineEntitiesRepository,
        private LoggerInterface $logger
    ) {}

    /**
     * Génère la timeline complète pour toutes les batailles et naissances existantes
     * Utilisé principalement par la commande pour génération initiale en masse
     * 
     * @return array
     */
    public function generateTimeline(): array
    {
        $stats = [
            'battles_created' => 0,
            'battles_updated' => 0,
            'births_created' => 0,
            'births_updated' => 0,
            'samurais_skipped' => 0,
        ];

        $battles = $this->battleRepository->findAll();
        foreach ($battles as $battle) {
            $isNew = $this->syncBattleTimeline($battle);
            if ($isNew) {
                $stats['battles_created']++;
            } else {
                $stats['battles_updated']++;
            }
        }

        $samourais = $this->samouraiRepository->findAll();
        foreach ($samourais as $samourai) {
            if ($samourai->getBirthDate() === null) {
                $stats['samurais_skipped']++;
                continue;
            }

            $isNew = $this->syncSamuraiBirthTimeline($samourai);
            if ($isNew) {
                $stats['births_created']++;
            } else {
                $stats['births_updated']++;
            }
        }

        $this->entityManager->flush();

        return $stats;
    }

    /**
     * Synchronise l'entrée Timeline pour une bataille spécifique
     * Crée une nouvelle entrée ou met à jour l'existante
     * 
     * @param Battle $battle
     * @return bool
     */
    public function syncBattleTimeline(Battle $battle): bool
    {
        $timeline = $this->timelineRepository->findOneBy([
            'type' => 'battle',
            'battle_id' => $battle
        ]);

        $isNew = false;

        if ($timeline === null) {
            $timeline = new Timeline();
            $timeline->setType('battle');
            $timeline->setBattleId($battle);
            $timeline->setCreatedAt(new \DateTimeImmutable());
            $isNew = true;

            $this->logger->info('Création d\'une nouvelle entrée de timeline pour la bataille', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);
        } else {
            $this->logger->info('Mise à jour d\'une entrée de timeline existante pour la bataille', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);
        }

        $timeline->setTitle($battle->getName());
        $timeline->setDate($battle->getDate());
        $timeline->setYear((int) $battle->getDate()->format('Y'));
        $timeline->setDescription($battle->getDescription());
        $timeline->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($timeline);

        if ($isNew) {
            $this->createTimelineEntity($timeline, 'battle', $battle->getId());
        }

        return $isNew;
    }

    /**
     * Synchronise l'entrée Timeline pour la naissance d'un samouraï
     * Crée une nouvelle entrée ou met à jour l'existante
     * 
     * @param Samourai $samourai
     * @return bool
     */
    public function syncSamuraiBirthTimeline(Samourai $samourai): bool
    {
        // Ignorer si pas de date de naissance
        if ($samourai->getBirthDate() === null) {
            return false;
        }

        $timelineEntity = $this->timelineEntitiesRepository->findOneBy([
            'entity_type' => 'samurai',
            'entity_id' => $samourai->getId()
        ]);

        $timeline = null;
        $isNew = false;

        // Si une TimelineEntity existe, récupérer la Timeline associée
        if ($timelineEntity !== null) {
            $timeline = $timelineEntity->getTimelineId();
            
            // Vérifier que c'est bien une entrée de type 'birth'
            if ($timeline !== null && $timeline->getType() !== 'birth') {
                $this->logger->warning('Timeline entity trouvée mais type n\'est pas birth', [
                    'samurai_id' => $samourai->getId(),
                    'timeline_type' => $timeline->getType()
                ]);
                $timeline = null;
            }
        }

        // Si pas d'entrée existante, en créer une nouvelle
        if ($timeline === null) {
            $timeline = new Timeline();
            $timeline->setType('birth');
            $timeline->setBattleId(null); // Les naissances ne sont pas liées à des batailles
            $timeline->setCreatedAt(new \DateTimeImmutable());
            $isNew = true;

            $this->logger->info('Création d\'une nouvelle entrée de timeline pour la naissance du samouraï', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName()
            ]);
        } else {
            $this->logger->info('Mise à jour d\'une entrée de timeline existante pour la naissance du samouraï', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName()
            ]);
        }

        // Mettre à jour les informations de la timeline
        $timeline->setTitle('Naissance de ' . $samourai->getName());
        $timeline->setDate($samourai->getBirthDate());
        $timeline->setYear((int) $samourai->getBirthDate()->format('Y'));
        $timeline->setDescription('Naissance du samurai ' . $samourai->getName());
        $timeline->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($timeline);

        if ($isNew) {
            $this->createTimelineEntity($timeline, 'samurai', $samourai->getId());
        }

        return $isNew;
    }

    /**
     * Supprime l'entrée Timeline associée à une bataille
     * utilisé lors de la suppression d'une bataille
     * 
     * @param Battle $battle
     */
    public function deleteBattleTimeline(Battle $battle): void
    {
        $timeline = $this->timelineRepository->findOneBy([
            'type' => 'battle',
            'battle_id' => $battle
        ]);

        if ($timeline !== null) {
            $this->logger->info('Suppression de l\'entrée de timeline pour la bataille', [
                'battle_id' => $battle->getId(),
                'timeline_id' => $timeline->getId()
            ]);

            $timelineEntities = $this->timelineEntitiesRepository->findBy([
                'timeline_id' => $timeline
            ]);

            foreach ($timelineEntities as $entity) {
                $this->entityManager->remove($entity);
            }

            $this->entityManager->remove($timeline);
            $this->entityManager->flush();
        }
    }

    /**
     * Supprime l'entrée Timeline associée à la naissance d'un samouraï
     * utilisé lors de la suppression d'un samouraï
     * 
     * @param Samourai $samourai
     */
    public function deleteSamuraiBirthTimeline(Samourai $samourai): void
    {
        $timelineEntity = $this->timelineEntitiesRepository->findOneBy([
            'entity_type' => 'samurai',
            'entity_id' => $samourai->getId()
        ]);

        if ($timelineEntity !== null) {
            $timeline = $timelineEntity->getTimelineId();

            $this->logger->info('Suppression de l\'entrée de timeline pour la naissance du samouraï', [
                'samurai_id' => $samourai->getId(),
                'timeline_id' => $timeline?->getId()
            ]);

            $this->entityManager->remove($timelineEntity);

            if ($timeline !== null && $timeline->getType() === 'birth') {
                $this->entityManager->remove($timeline);
            }

            $this->entityManager->flush();
        }
    }

    

    /**
     * Crée une entrée TimelineEntities pour lier une timeline à une entité
     * 
     * @param Timeline $timeline
     * @param string $entityType
     * @param int $entityId
     */
    private function createTimelineEntity(Timeline $timeline, string $entityType, int $entityId): void
    {
        $timelineEntity = new TimelineEntities();
        $timelineEntity->setTimelineId($timeline);
        $timelineEntity->setEntityType($entityType);
        $timelineEntity->setEntityId($entityId);

        $this->entityManager->persist($timelineEntity);

        $this->logger->info('Création d\'un lien entre une timeline et une entité', [
            'entity_type' => $entityType,
            'entity_id' => $entityId
        ]);
    }
}





























/**
     * Synchronise les événements historiques (politique et duels) dans la timeline
     * les données proviennent de HistoricalEventsData
     * 
     * @return array Statistiques [created, updated, skipped]
     */
    // public function syncHistoricalEvents(): array
    // {
    //     $stats = [
    //         'created' => 0,
    //         'updated' => 0,
    //         'skipped' => 0,
    //     ];

    //     $historicalEvents = HistoricalEventsData::getHistoricalEvents();

    //     foreach ($historicalEvents as $eventData) {
    //         try {
    //             $existingTimeline = $this->timelineRepository->findOneBy([
    //                 'title' => $eventData['title'],
    //                 'year' => $eventData['year']
    //             ]);

    //             $isNew = false;

    //             if ($existingTimeline === null) {
    //                 $timeline = new Timeline();
    //                 $timeline->setCreatedAt(new \DateTimeImmutable());
    //                 $isNew = true;
    //                 $stats['created']++;

    //                 $this->logger->info('Création d\'une nouvelle entrée de timeline pour l\'événement historique', [
    //                     'title' => $eventData['title'],
    //                     'year' => $eventData['year'],
    //                     'type' => $eventData['type']
    //                 ]);
    //             } else {
    //                 $timeline = $existingTimeline;
    //                 $stats['updated']++;

    //                 $this->logger->info('Mise à jour d\'une entrée de timeline existante pour l\'événement historique', [
    //                     'title' => $eventData['title'],
    //                     'year' => $eventData['year']
    //                 ]);
    //             }

    //             $timeline->setTitle($eventData['title']);
    //             $timeline->setType($eventData['type']);
    //             $timeline->setYear($eventData['year']);
                
    //             $date = new \DateTime($eventData['date']);
    //             $timeline->setDate($date);
                
    //             $timeline->setDescription($eventData['description']);
    //             $timeline->setBattleId(null);
    //             $timeline->setUpdatedAt(new \DateTimeImmutable());

    //             $this->entityManager->persist($timeline);

    //         } catch (\Exception $e) {
    //             $this->logger->error('Erreur lors de la synchronisation de l\'événement historique', [
    //                 'title' => $eventData['title'] ?? 'unknown',
    //                 'error' => $e->getMessage()
    //             ]);
    //             $stats['skipped']++;
    //         }
    //     }

    //     $this->entityManager->flush();

    //     return $stats;
    // }