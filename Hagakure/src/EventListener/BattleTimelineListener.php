<?php

namespace App\EventListener;

use App\Entity\Battle;
use App\Service\TimelineGeneratorService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Psr\Log\LoggerInterface;

/**
 * Event Listener Doctrine pour synchroniser automatiquement la Timeline
 * lors des opérations CRUD sur l'entité Battle
 * 
 * Ce listener assure que chaque bataille a toujours une entrée correspondante
 * dans la timeline, créée/mise à jour automatiquement
 */
#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Battle::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Battle::class)]
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: Battle::class)]
class BattleTimelineListener
{
    public function __construct(
        private TimelineGeneratorService $timelineGenerator,
        private LoggerInterface $logger
    ) {}

    /**
     * Appelé automatiquement après la création d'une nouvelle Battle
     * Crée l'entrée Timeline correspondante
     * 
     * @param Battle $battle
     * @param LifecycleEventArgs $event 
     */
    public function postPersist(Battle $battle, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('BattleTimelineListener: postPersist triggered', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);

            $this->timelineGenerator->syncBattleTimeline($battle);
            $event->getObjectManager()->flush();

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans BattleTimelineListener::postPersist', [
                'battle_id' => $battle->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement après la modification d'une Battle existante
     * Met à jour l'entrée Timeline correspondante
     * 
     * @param Battle $battle
     * @param LifecycleEventArgs $event 
     */
    public function postUpdate(Battle $battle, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('BattleTimelineListener: postUpdate triggered', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);

            $this->timelineGenerator->syncBattleTimeline($battle);
            $event->getObjectManager()->flush();

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans BattleTimelineListener::postUpdate', [
                'battle_id' => $battle->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement avant la suppression d'une Battle
     * Supprime l'entrée Timeline correspondante pour éviter les orphelins
     * 
     * @param Battle $battle
     * @param LifecycleEventArgs $event 
     */
    public function preRemove(Battle $battle, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('BattleTimelineListener: preRemove triggered', [
                'battle_id' => $battle->getId(),
                'battle_name' => $battle->getName()
            ]);

            // supprimer l'entrée timeline pour cette bataille
            $this->timelineGenerator->deleteBattleTimeline($battle);

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans BattleTimelineListener::preRemove', [
                'battle_id' => $battle->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }
}

