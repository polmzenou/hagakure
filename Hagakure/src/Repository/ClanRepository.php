<?php

namespace App\Repository;

use App\Entity\Clan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Clan>
 */
class ClanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Clan::class);
    }

    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.leader_id', 'l')
            ->addSelect('l')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithRelations(int $id): ?Clan
    {
        return $this->createQueryBuilder('c')
            ->leftJoin('c.leader_id', 'l')
            ->addSelect('l')
            ->where('c.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
