<?php

namespace App\Controller;

use App\Entity\Weapon;
use App\Repository\WeaponRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class WeaponController extends AbstractController
{
    #[Route('/weapons', name: 'app_weapon_index')]
    public function index(WeaponRepository $repository): Response
    {
        return $this->render('weapon/index.html.twig', ['weapons' => $repository->findAll()]);
    }

    #[Route('/weapons/new', name: 'app_weapon_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $weapon = new Weapon();
        $form = $this->createFormBuilder($weapon)
            ->add('name')
            ->add('type')
            ->add('description')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $weapon->setSlug($slugger->slug($weapon->getName())->lower());
            $weapon->setCreatedAt(new \DateTimeImmutable());
            $weapon->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($weapon);
            $entityManager->flush();

            return $this->redirectToRoute('app_weapon_index');
        }

        return $this->render('weapon/new.html.twig', ['form' => $form]);
    }

    #[Route('/weapons/{id}/edit', name: 'app_weapon_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Weapon $weapon, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createFormBuilder($weapon)
            ->add('name')
            ->add('type')
            ->add('description')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $weapon->setSlug($slugger->slug($weapon->getName())->lower());
            $weapon->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->redirectToRoute('app_weapon_index');
        }

        return $this->render('weapon/edit.html.twig', ['weapon' => $weapon, 'form' => $form]);
    }

    #[Route('/weapons/{id}', name: 'app_weapon_delete', methods: ['POST'])]
    public function delete(Request $request, Weapon $weapon, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$weapon->getId(), $request->request->get('_token'))) {
            $entityManager->remove($weapon);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_weapon_index');
    }
}

