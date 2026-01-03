<?php

namespace App\Command;

use App\Service\TimelineGeneratorService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

/**
 * Commande Symfony pour générer la timeline complète
 * à partir de toutes les batailles et naissances de samourais existantes
 * 
 * Usage: php bin/console app:timeline:generate
 */
#[AsCommand(
    name: 'app:timeline:generate',
    description: 'Génère la timeline complète pour toutes les batailles et naissances existantes',
)]
class GenerateTimelineCommand extends Command
{
    public function __construct(
        private TimelineGeneratorService $timelineGenerator
    ) {
        parent::__construct();
    }

    /**
     * Configure la commande avec les options disponibles
     */
    protected function configure(): void
    {
        $this->setHelp(
            'Cette commande scanne toutes les batailles et samourais existants ' .
            'et génère automatiquement les entrées correspondantes dans la timeline. ' .
            'Elle crée de nouvelles entrées ou met à jour celles existantes.'
        );
    }

    /**
     * Exécute la génération de la timeline
     * 
     * @param InputInterface $input Interface d'entrée de la commande
     * @param OutputInterface $output Interface de sortie de la commande
     * @return int Code de retour (0 = succès, autre = erreur)
     */
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Afficher le titre de la commande
        $io->title('Timeline Generator');
        $io->text('Génération de la timeline pour toutes les batailles et naissances de samourais...');
        $io->newLine();

        // Démarrer le chronomètre
        $startTime = microtime(true);

        try {
            // Générer la timeline complète
            $io->text('Scanning battles and samourais...');
            $stats = $this->timelineGenerator->generateTimeline();

            // Calculer le temps d'exécution
            $executionTime = round(microtime(true) - $startTime, 2);

            // Afficher les statistiques
            $io->success('Timeline generated successfully!');
            $io->newLine();

            // Créer un tableau de statistiques pour l'affichage
            $io->section('Statistics');
            $io->table(
                ['Category', 'Count'],
                [
                    ['Battles - Created', $stats['battles_created']],
                    ['Battles - Updated', $stats['battles_updated']],
                    ['Births - Created', $stats['births_created']],
                    ['Births - Updated', $stats['births_updated']],
                    ['Samourais - Skipped (no birth_date)', $stats['samurais_skipped']],
                ]
            );

            // Calcul des totaux
            $totalCreated = $stats['battles_created'] + $stats['births_created'];
            $totalUpdated = $stats['battles_updated'] + $stats['births_updated'];
            $totalProcessed = $totalCreated + $totalUpdated;

            $io->newLine();
            $io->text([
                sprintf('<info>Total timeline entries processed:</info> %d', $totalProcessed),
                sprintf('  - <fg=green>Created:</> %d', $totalCreated),
                sprintf('  - <fg=yellow>Updated:</> %d', $totalUpdated),
                sprintf('  - <fg=red>Skipped:</> %d', $stats['samurais_skipped']),
            ]);

            $io->newLine();
            $io->text(sprintf('<comment>Execution time:</comment> %s seconds', $executionTime));

            // Afficher un message d'information sur la synchronisation automatique
            $io->newLine();
            $io->note([
                'Les futures batailles et samourais seront automatiquement synchronisés',
                'grâce aux Event Listeners Doctrine.',
                'Vous n\'avez pas besoin de relancer cette commande manuellement.'
            ]);

            return Command::SUCCESS;

        } catch (\Exception $e) {
            // En cas d'erreur, afficher le message et retourner un code d'erreur
            $io->error('An error occurred during timeline generation');
            $io->text([
                '<fg=red>Error:</> ' . $e->getMessage(),
                '<fg=yellow>File:</> ' . $e->getFile() . ':' . $e->getLine(),
            ]);

            if ($output->isVerbose()) {
                $io->section('Stack Trace');
                $io->text($e->getTraceAsString());
            }

            return Command::FAILURE;
        }
    }
}

