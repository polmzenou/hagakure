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
     * @return array Statistiques de génération [created, updated, skipped]
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

        // Traiter toutes les batailles
        $battles = $this->battleRepository->findAll();
        foreach ($battles as $battle) {
            $isNew = $this->syncBattleTimeline($battle);
            if ($isNew) {
                $stats['battles_created']++;
            } else {
                $stats['battles_updated']++;
            }
        }

        // Traiter toutes les naissances de samourais
        $samourais = $this->samouraiRepository->findAll();
        foreach ($samourais as $samourai) {
            // Ignorer les samourais sans date de naissance
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

        // Sauvegarder toutes les modifications
        $this->entityManager->flush();

        return $stats;
    }

    /**
     * Synchronise l'entrée Timeline pour une bataille spécifique
     * Crée une nouvelle entrée ou met à jour l'existante
     * 
     * @param Battle $battle La bataille à synchroniser
     * @return bool True si création, False si mise à jour
     */
    public function syncBattleTimeline(Battle $battle): bool
    {
        // Chercher une entrée Timeline existante pour cette bataille
        // Critère : type='battle' ET battle_id = battle
        $timeline = $this->timelineRepository->findOneBy([
            'type' => 'battle',
            'battle_id' => $battle
        ]);

        $isNew = false;

        // Si pas d'entrée existante, en créer une nouvelle
        if ($timeline === null) {
            $timeline = new Timeline();
            $timeline->setType('battle');
            $timeline->setBattleId($battle);
            $timeline->setCreatedAt(new \DateTimeImmutable());
            $isNew = true;

            $this->logger->info('Creating new timeline entry for battle', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);
        } else {
            $this->logger->info('Updating existing timeline entry for battle', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);
        }

        // Mettre à jour les informations de la timeline
        $timeline->setTitle($battle->getName());
        $timeline->setDate($battle->getDate());
        $timeline->setYear((int) $battle->getDate()->format('Y'));
        $timeline->setDescription($battle->getDescription());
        $timeline->setUpdatedAt(new \DateTimeImmutable());

        // Persister la timeline
        $this->entityManager->persist($timeline);

        // Gérer l'entrée TimelineEntities correspondante
        if ($isNew) {
            $this->createTimelineEntity($timeline, 'battle', $battle->getId());
        }

        return $isNew;
    }

    /**
     * Synchronise l'entrée Timeline pour la naissance d'un samouraï
     * Crée une nouvelle entrée ou met à jour l'existante
     * 
     * @param Samourai $samourai Le samouraï dont on synchronise la naissance
     * @return bool True si création, False si mise à jour
     */
    public function syncSamuraiBirthTimeline(Samourai $samourai): bool
    {
        // Ignorer si pas de date de naissance
        if ($samourai->getBirthDate() === null) {
            return false;
        }

        // Chercher une entrée Timeline existante pour cette naissance
        // On doit chercher via TimelineEntities car on n'a pas de relation directe
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
                $this->logger->warning('Timeline entity found but type is not birth', [
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

            $this->logger->info('Creating new timeline entry for samurai birth', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName()
            ]);
        } else {
            $this->logger->info('Updating existing timeline entry for samurai birth', [
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

        // Persister la timeline
        $this->entityManager->persist($timeline);

        // Gérer l'entrée TimelineEntities correspondante
        if ($isNew) {
            $this->createTimelineEntity($timeline, 'samurai', $samourai->getId());
        }

        return $isNew;
    }

    /**
     * Supprime l'entrée Timeline associée à une bataille
     * Utilisé lors de la suppression d'une bataille
     * 
     * @param Battle $battle La bataille dont on supprime la timeline
     */
    public function deleteBattleTimeline(Battle $battle): void
    {
        // Chercher l'entrée Timeline pour cette bataille
        $timeline = $this->timelineRepository->findOneBy([
            'type' => 'battle',
            'battle_id' => $battle
        ]);

        if ($timeline !== null) {
            $this->logger->info('Deleting timeline entry for battle', [
                'battle_id' => $battle->getId(),
                'timeline_id' => $timeline->getId()
            ]);

            // Supprimer les TimelineEntities associées
            $timelineEntities = $this->timelineEntitiesRepository->findBy([
                'timeline_id' => $timeline
            ]);

            foreach ($timelineEntities as $entity) {
                $this->entityManager->remove($entity);
            }

            // Supprimer la Timeline
            $this->entityManager->remove($timeline);
            $this->entityManager->flush();
        }
    }

    /**
     * Supprime l'entrée Timeline associée à la naissance d'un samouraï
     * Utilisé lors de la suppression d'un samouraï
     * 
     * @param Samourai $samourai Le samouraï dont on supprime la timeline de naissance
     */
    public function deleteSamuraiBirthTimeline(Samourai $samourai): void
    {
        // Chercher l'entrée TimelineEntity pour ce samouraï
        $timelineEntity = $this->timelineEntitiesRepository->findOneBy([
            'entity_type' => 'samurai',
            'entity_id' => $samourai->getId()
        ]);

        if ($timelineEntity !== null) {
            $timeline = $timelineEntity->getTimelineId();

            $this->logger->info('Deleting timeline entry for samurai birth', [
                'samurai_id' => $samourai->getId(),
                'timeline_id' => $timeline?->getId()
            ]);

            // Supprimer la TimelineEntity
            $this->entityManager->remove($timelineEntity);

            // Supprimer la Timeline si elle existe et est de type 'birth'
            if ($timeline !== null && $timeline->getType() === 'birth') {
                $this->entityManager->remove($timeline);
            }

            $this->entityManager->flush();
        }
    }

    /**
     * Synchronise les événements historiques (politique et duels) dans la timeline
     * Les données proviennent de HistoricalEventsData
     * 
     * @return array Statistiques [created, updated, skipped]
     */
    public function syncHistoricalEvents(): array
    {
        $stats = [
            'created' => 0,
            'updated' => 0,
            'skipped' => 0,
        ];

        // Récupérer les événements historiques depuis le fichier de données
        $historicalEvents = HistoricalEventsData::getHistoricalEvents();

        foreach ($historicalEvents as $eventData) {
            try {
                // Vérifier si l'événement existe déjà (par titre + année pour éviter les doublons)
                $existingTimeline = $this->timelineRepository->findOneBy([
                    'title' => $eventData['title'],
                    'year' => $eventData['year']
                ]);

                $isNew = false;

                if ($existingTimeline === null) {
                    // Créer une nouvelle entrée Timeline
                    $timeline = new Timeline();
                    $timeline->setCreatedAt(new \DateTimeImmutable());
                    $isNew = true;
                    $stats['created']++;

                    $this->logger->info('Creating new historical timeline entry', [
                        'title' => $eventData['title'],
                        'year' => $eventData['year'],
                        'type' => $eventData['type']
                    ]);
                } else {
                    // Mettre à jour l'entrée existante
                    $timeline = $existingTimeline;
                    $stats['updated']++;

                    $this->logger->info('Updating existing historical timeline entry', [
                        'title' => $eventData['title'],
                        'year' => $eventData['year']
                    ]);
                }

                // Mettre à jour les informations de la timeline
                $timeline->setTitle($eventData['title']);
                $timeline->setType($eventData['type']); // 'politique' ou 'duel'
                $timeline->setYear($eventData['year']);
                
                // Convertir la date string en DateTime
                $date = new \DateTime($eventData['date']);
                $timeline->setDate($date);
                
                $timeline->setDescription($eventData['description']);
                $timeline->setBattleId(null); // Les événements historiques ne sont pas liés à des batailles
                $timeline->setUpdatedAt(new \DateTimeImmutable());

                // Persister la timeline
                $this->entityManager->persist($timeline);

            } catch (\Exception $e) {
                $this->logger->error('Error syncing historical event', [
                    'title' => $eventData['title'] ?? 'unknown',
                    'error' => $e->getMessage()
                ]);
                $stats['skipped']++;
            }
        }

        // Sauvegarder toutes les modifications
        $this->entityManager->flush();

        return $stats;
    }

    /**
     * Crée une entrée TimelineEntities pour lier une Timeline à une entité
     * 
     * @param Timeline $timeline La timeline à lier
     * @param string $entityType Type d'entité ('battle' ou 'samurai')
     * @param int $entityId ID de l'entité
     */
    private function createTimelineEntity(Timeline $timeline, string $entityType, int $entityId): void
    {
        $timelineEntity = new TimelineEntities();
        $timelineEntity->setTimelineId($timeline);
        $timelineEntity->setEntityType($entityType);
        $timelineEntity->setEntityId($entityId);

        $this->entityManager->persist($timelineEntity);

        $this->logger->info('Creating timeline entity link', [
            'entity_type' => $entityType,
            'entity_id' => $entityId
        ]);
    }
}

