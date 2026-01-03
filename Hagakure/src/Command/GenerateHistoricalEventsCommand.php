<?php

namespace App\Command;

use App\Service\TimelineGeneratorService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Commande pour ajouter les événements historiques (politique et duels) à la timeline
 * Utilise les données de HistoricalEventsData
 */
#[AsCommand(
    name: 'app:timeline:generate-historical',
    description: 'Ajoute les événements historiques (politique et duels) à la timeline'
)]
class GenerateHistoricalEventsCommand extends Command
{
    public function __construct(
        private TimelineGeneratorService $timelineGenerator
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Génération des événements historiques pour la timeline');
        $io->text([
            'Cette commande ajoute ou met à jour les événements historiques',
            'dans la timeline (événements politiques et duels de 800 à 1900).',
            ''
        ]);

        // Démarrer la synchronisation
        $io->section('Synchronisation des événements historiques...');
        
        try {
            $stats = $this->timelineGenerator->syncHistoricalEvents();

            // Afficher les résultats
            $io->success('Synchronisation terminée avec succès !');
            
            $io->section('Résultats :');
            $io->table(
                ['Type', 'Nombre'],
                [
                    ['Événements créés', $stats['created']],
                    ['Événements mis à jour', $stats['updated']],
                    ['Événements ignorés (erreurs)', $stats['skipped']],
                ]
            );

            $total = $stats['created'] + $stats['updated'];
            $io->note("Total d'événements synchronisés : {$total}");

            if ($stats['skipped'] > 0) {
                $io->warning("Attention : {$stats['skipped']} événements ont été ignorés à cause d'erreurs. Consultez les logs pour plus de détails.");
            }

            return Command::SUCCESS;

        } catch (\Exception $e) {
            $io->error([
                'Une erreur est survenue lors de la synchronisation :',
                $e->getMessage()
            ]);

            return Command::FAILURE;
        }
    }
}

