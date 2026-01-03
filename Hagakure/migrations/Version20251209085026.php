<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251209085026 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE battle CHANGE image image LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE clan CHANGE image image LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE samourai CHANGE image image LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE style CHANGE image image LONGTEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE weapon CHANGE image image LONGTEXT DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE battle CHANGE image image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE clan CHANGE image image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE samourai CHANGE image image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE style CHANGE image image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE weapon CHANGE image image VARCHAR(255) DEFAULT NULL');
    }
}
