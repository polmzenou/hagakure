<?php

namespace App\EventListener;

use App\Entity\Samourai;
use App\Service\TimelineGeneratorService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Psr\Log\LoggerInterface;

/**
 * Event Listener Doctrine pour synchroniser automatiquement la Timeline
 * lors des opérations CRUD sur l'entité Samourai
 * 
 * Ce listener assure que chaque samouraï avec une date de naissance a une entrée
 * correspondante dans la timeline, créée/mise à jour automatiquement
 */
#[AsEntityListener(event: Events::postPersist, method: 'postPersist', entity: Samourai::class)]
#[AsEntityListener(event: Events::postUpdate, method: 'postUpdate', entity: Samourai::class)]
#[AsEntityListener(event: Events::preRemove, method: 'preRemove', entity: Samourai::class)]
class SamouraiTimelineListener
{
    public function __construct(
        private TimelineGeneratorService $timelineGenerator,
        private LoggerInterface $logger
    ) {}

    /**
     * Appelé automatiquement après la création d'un nouveau Samourai
     * Crée l'entrée Timeline de naissance si birth_date existe
     * 
     * @param Samourai $samourai
     * @param LifecycleEventArgs $event 
     */
    public function postPersist(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: postPersist triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName(),
                'has_birth_date' => $samourai->getBirthDate() !== null
            ]);

            if ($samourai->getBirthDate() !== null) {
                $this->timelineGenerator->syncSamuraiBirthTimeline($samourai);
                $event->getObjectManager()->flush();
            } else {
                $this->logger->info('Passage sans date de naissance, pas de création de timeline', [
                    'samurai_id' => $samourai->getId()
                ]);
            }

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans SamouraiTimelineListener::postPersist', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement après la modification d'un Samourai existant
     * Met à jour l'entrée Timeline si birth_date existe, ou la supprime si birth_date a été retirée
     * 
     * @param Samourai $samourai
     * @param LifecycleEventArgs $event 
     */
    public function postUpdate(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: postUpdate triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName(),
                'has_birth_date' => $samourai->getBirthDate() !== null
            ]);

            if ($samourai->getBirthDate() !== null) {
                $this->timelineGenerator->syncSamuraiBirthTimeline($samourai);
                $event->getObjectManager()->flush();
            } else {
                $this->logger->info('Date de naissance retirée, suppression de l\'entrée de timeline si elle existe', [
                    'samurai_id' => $samourai->getId()
                ]);

                $this->timelineGenerator->deleteSamuraiBirthTimeline($samourai);
            }

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans SamouraiTimelineListener::postUpdate', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement avant la suppression d'un Samourai
     * Supprime l'entrée Timeline de naissance correspondante pour éviter les orphelins
     * 
     * @param Samourai $samourai
     * @param LifecycleEventArgs $event 
     */
    public function preRemove(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: preRemove triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName()
            ]);

            // supprimer l'entrée timeline de naissance pour ce samouraï
            $this->timelineGenerator->deleteSamuraiBirthTimeline($samourai);

        } catch (\Exception $e) {
            $this->logger->error('Erreur dans SamouraiTimelineListener::preRemove', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }
}

