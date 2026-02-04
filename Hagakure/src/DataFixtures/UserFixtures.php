<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        // Créer un utilisateur admin
        $admin = new User();
        $admin->setEmail('admin@hagakure.fr');
        $admin->setRoles(['ROLE_ADMIN']);
        $hashedPassword = $this->passwordHasher->hashPassword($admin, 'admin123');
        $admin->setPassword($hashedPassword);
        $manager->persist($admin);
        $this->addReference('user_admin', $admin);

        // Créer quelques utilisateurs lambda
        $users = [
            [
                'email' => 'user1@hagakure.fr',
                'password' => 'user123',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'user2@hagakure.fr',
                'password' => 'user123',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'test@hagakure.fr',
                'password' => 'test123',
                'roles' => ['ROLE_USER']
            ],
        ];

        foreach ($users as $index => $userData) {
            $user = new User();
            $user->setEmail($userData['email']);
            $user->setRoles($userData['roles']);
            $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);
            $user->setPassword($hashedPassword);
            $manager->persist($user);
            $this->addReference('user_' . ($index + 1), $user);
        }

        $manager->flush();
    }
}
