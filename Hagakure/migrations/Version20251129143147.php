<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251129143147 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE battle (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, date DATETIME NOT NULL, description LONGTEXT NOT NULL, source_url LONGTEXT DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, location_id_id INT DEFAULT NULL, winner_clan_id_id INT DEFAULT NULL, INDEX IDX_13991734918DB72 (location_id_id), INDEX IDX_13991734B2E29111 (winner_clan_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE clan (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, founded_date DATETIME DEFAULT NULL, disbanded_date DATETIME DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, leader_id_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_9FF6A30CEFE6DECF (leader_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE favorite (id INT AUTO_INCREMENT NOT NULL, entity_type VARCHAR(255) NOT NULL, entity_id INT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, user_id_id INT DEFAULT NULL, INDEX IDX_68C58ED99D86650F (user_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE location (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, region VARCHAR(255) NOT NULL, latitude NUMERIC(20, 20) NOT NULL, longitude NUMERIC(20, 20) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE samourai (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, birth_date DATETIME DEFAULT NULL, death_date DATETIME DEFAULT NULL, description LONGTEXT NOT NULL, source_url LONGTEXT DEFAULT NULL, image VARCHAR(255) DEFAULT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, clan_id_id INT DEFAULT NULL, INDEX IDX_86289DD9E07BE140 (clan_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE samourai_weapon (samourai_id INT NOT NULL, weapon_id INT NOT NULL, INDEX IDX_36208E4C154397A4 (samourai_id), INDEX IDX_36208E4C95B82273 (weapon_id), PRIMARY KEY (samourai_id, weapon_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE samourai_style (samourai_id INT NOT NULL, style_id INT NOT NULL, INDEX IDX_251C1A53154397A4 (samourai_id), INDEX IDX_251C1A53BACD6074 (style_id), PRIMARY KEY (samourai_id, style_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE samourai_battle (samourai_id INT NOT NULL, battle_id INT NOT NULL, INDEX IDX_4C8A3E9E154397A4 (samourai_id), INDEX IDX_4C8A3E9EC9732719 (battle_id), PRIMARY KEY (samourai_id, battle_id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE style (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, image VARCHAR(255) DEFAULT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE timeline (id INT AUTO_INCREMENT NOT NULL, year INT NOT NULL, date DATE NOT NULL, title VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, battle_id_id INT DEFAULT NULL, INDEX IDX_46FEC666667FCFE5 (battle_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE timeline_entities (id INT AUTO_INCREMENT NOT NULL, entity_type VARCHAR(255) NOT NULL, entity_id INT NOT NULL, timeline_id_id INT DEFAULT NULL, INDEX IDX_DC3FEE5F2A1311 (timeline_id_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE weapon (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, image VARCHAR(255) DEFAULT NULL, slug VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL, available_at DATETIME NOT NULL, delivered_at DATETIME DEFAULT NULL, INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE battle ADD CONSTRAINT FK_13991734918DB72 FOREIGN KEY (location_id_id) REFERENCES location (id)');
        $this->addSql('ALTER TABLE battle ADD CONSTRAINT FK_13991734B2E29111 FOREIGN KEY (winner_clan_id_id) REFERENCES clan (id)');
        $this->addSql('ALTER TABLE clan ADD CONSTRAINT FK_9FF6A30CEFE6DECF FOREIGN KEY (leader_id_id) REFERENCES samourai (id)');
        $this->addSql('ALTER TABLE favorite ADD CONSTRAINT FK_68C58ED99D86650F FOREIGN KEY (user_id_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE samourai ADD CONSTRAINT FK_86289DD9E07BE140 FOREIGN KEY (clan_id_id) REFERENCES clan (id)');
        $this->addSql('ALTER TABLE samourai_weapon ADD CONSTRAINT FK_36208E4C154397A4 FOREIGN KEY (samourai_id) REFERENCES samourai (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE samourai_weapon ADD CONSTRAINT FK_36208E4C95B82273 FOREIGN KEY (weapon_id) REFERENCES weapon (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE samourai_style ADD CONSTRAINT FK_251C1A53154397A4 FOREIGN KEY (samourai_id) REFERENCES samourai (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE samourai_style ADD CONSTRAINT FK_251C1A53BACD6074 FOREIGN KEY (style_id) REFERENCES style (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE samourai_battle ADD CONSTRAINT FK_4C8A3E9E154397A4 FOREIGN KEY (samourai_id) REFERENCES samourai (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE samourai_battle ADD CONSTRAINT FK_4C8A3E9EC9732719 FOREIGN KEY (battle_id) REFERENCES battle (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE timeline ADD CONSTRAINT FK_46FEC666667FCFE5 FOREIGN KEY (battle_id_id) REFERENCES battle (id)');
        $this->addSql('ALTER TABLE timeline_entities ADD CONSTRAINT FK_DC3FEE5F2A1311 FOREIGN KEY (timeline_id_id) REFERENCES timeline (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE battle DROP FOREIGN KEY FK_13991734918DB72');
        $this->addSql('ALTER TABLE battle DROP FOREIGN KEY FK_13991734B2E29111');
        $this->addSql('ALTER TABLE clan DROP FOREIGN KEY FK_9FF6A30CEFE6DECF');
        $this->addSql('ALTER TABLE favorite DROP FOREIGN KEY FK_68C58ED99D86650F');
        $this->addSql('ALTER TABLE samourai DROP FOREIGN KEY FK_86289DD9E07BE140');
        $this->addSql('ALTER TABLE samourai_weapon DROP FOREIGN KEY FK_36208E4C154397A4');
        $this->addSql('ALTER TABLE samourai_weapon DROP FOREIGN KEY FK_36208E4C95B82273');
        $this->addSql('ALTER TABLE samourai_style DROP FOREIGN KEY FK_251C1A53154397A4');
        $this->addSql('ALTER TABLE samourai_style DROP FOREIGN KEY FK_251C1A53BACD6074');
        $this->addSql('ALTER TABLE samourai_battle DROP FOREIGN KEY FK_4C8A3E9E154397A4');
        $this->addSql('ALTER TABLE samourai_battle DROP FOREIGN KEY FK_4C8A3E9EC9732719');
        $this->addSql('ALTER TABLE timeline DROP FOREIGN KEY FK_46FEC666667FCFE5');
        $this->addSql('ALTER TABLE timeline_entities DROP FOREIGN KEY FK_DC3FEE5F2A1311');
        $this->addSql('DROP TABLE battle');
        $this->addSql('DROP TABLE clan');
        $this->addSql('DROP TABLE favorite');
        $this->addSql('DROP TABLE location');
        $this->addSql('DROP TABLE samourai');
        $this->addSql('DROP TABLE samourai_weapon');
        $this->addSql('DROP TABLE samourai_style');
        $this->addSql('DROP TABLE samourai_battle');
        $this->addSql('DROP TABLE style');
        $this->addSql('DROP TABLE timeline');
        $this->addSql('DROP TABLE timeline_entities');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE weapon');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
