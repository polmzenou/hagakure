<?php

namespace App\Repository;

use App\Entity\Battle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Battle>
 */
class BattleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Battle::class);
    }

    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('b')
            ->leftJoin('b.location_id', 'l')
            ->addSelect('l')
            ->leftJoin('b.winner_clan_id', 'wc')
            ->addSelect('wc')
            ->leftJoin('b.samourais', 's')
            ->addSelect('s')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithRelations(int $id): ?Battle
    {
        return $this->createQueryBuilder('b')
            ->leftJoin('b.location_id', 'l')
            ->addSelect('l')
            ->leftJoin('b.winner_clan_id', 'wc')
            ->addSelect('wc')
            ->leftJoin('b.samourais', 's')
            ->addSelect('s')
            ->where('b.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
