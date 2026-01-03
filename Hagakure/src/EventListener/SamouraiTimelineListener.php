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
     * @param Samourai $samourai Le samouraï nouvellement créé
     * @param LifecycleEventArgs $event L'événement Doctrine
     */
    public function postPersist(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: postPersist triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName(),
                'has_birth_date' => $samourai->getBirthDate() !== null
            ]);

            // Ne créer une entrée timeline que si le samouraï a une date de naissance
            if ($samourai->getBirthDate() !== null) {
                // Synchroniser la timeline pour ce samouraï
                $this->timelineGenerator->syncSamuraiBirthTimeline($samourai);

                // Flush pour persister les changements de timeline
                $event->getObjectManager()->flush();
            } else {
                $this->logger->info('Skipping timeline creation: samurai has no birth_date', [
                    'samurai_id' => $samourai->getId()
                ]);
            }

        } catch (\Exception $e) {
            $this->logger->error('Error in SamouraiTimelineListener::postPersist', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement après la modification d'un Samourai existant
     * Met à jour l'entrée Timeline si birth_date existe, ou la supprime si birth_date a été retirée
     * 
     * @param Samourai $samourai Le samouraï modifié
     * @param LifecycleEventArgs $event L'événement Doctrine
     */
    public function postUpdate(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: postUpdate triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName(),
                'has_birth_date' => $samourai->getBirthDate() !== null
            ]);

            // Si le samouraï a une date de naissance, synchroniser la timeline
            if ($samourai->getBirthDate() !== null) {
                // Synchroniser la timeline pour ce samouraï
                // (créera ou mettra à jour l'entrée existante)
                $this->timelineGenerator->syncSamuraiBirthTimeline($samourai);

                // Flush pour persister les changements de timeline
                $event->getObjectManager()->flush();
            } else {
                // Si le samouraï n'a plus de date de naissance,
                // supprimer l'entrée timeline si elle existait
                $this->logger->info('Birth date removed, deleting timeline entry if exists', [
                    'samurai_id' => $samourai->getId()
                ]);

                $this->timelineGenerator->deleteSamuraiBirthTimeline($samourai);
            }

        } catch (\Exception $e) {
            $this->logger->error('Error in SamouraiTimelineListener::postUpdate', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Appelé automatiquement avant la suppression d'un Samourai
     * Supprime l'entrée Timeline de naissance correspondante pour éviter les orphelins
     * 
     * @param Samourai $samourai Le samouraï sur le point d'être supprimé
     * @param LifecycleEventArgs $event L'événement Doctrine
     */
    public function preRemove(Samourai $samourai, LifecycleEventArgs $event): void
    {
        try {
            $this->logger->info('SamouraiTimelineListener: preRemove triggered', [
                'samurai_id' => $samourai->getId(),
                'samurai_name' => $samourai->getName()
            ]);

            // Supprimer l'entrée timeline de naissance pour ce samouraï
            $this->timelineGenerator->deleteSamuraiBirthTimeline($samourai);

        } catch (\Exception $e) {
            $this->logger->error('Error in SamouraiTimelineListener::preRemove', [
                'samurai_id' => $samourai->getId(),
                'error' => $e->getMessage()
            ]);
        }
    }
}

