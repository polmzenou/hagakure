<?php

namespace App\Repository;

use App\Entity\Samourai;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Samourai>
 */
class SamouraiRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Samourai::class);
    }

    public function findAllWithRelations(): array
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.clan_id', 'c')
            ->addSelect('c')
            ->leftJoin('s.weapon', 'w')
            ->addSelect('w')
            ->leftJoin('s.style_id', 'st')
            ->addSelect('st')
            ->getQuery()
            ->getResult();
    }

    public function findOneWithRelations(int $id): ?Samourai
    {
        return $this->createQueryBuilder('s')
            ->leftJoin('s.clan_id', 'c')
            ->addSelect('c')
            ->leftJoin('s.weapon', 'w')
            ->addSelect('w')
            ->leftJoin('s.style_id', 'st')
            ->addSelect('st')
            ->where('s.id = :id')
            ->setParameter('id', $id)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
