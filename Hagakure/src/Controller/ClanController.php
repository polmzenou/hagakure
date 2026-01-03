<?php

namespace App\Controller;

use App\Entity\Clan;
use App\Repository\ClanRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class ClanController extends AbstractController
{
    #[Route('/clans', name: 'app_clan_index')]
    public function index(ClanRepository $repository): Response
    {
        return $this->render('clan/index.html.twig', [
            'clans' => $repository->findAll(),
        ]);
    }

    #[Route('/clans/new', name: 'app_clan_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $clan = new Clan();
        $form = $this->createFormBuilder($clan)
            ->add('name')
            ->add('description')
            ->add('founded_date', null, ['widget' => 'single_text'])
            ->add('disbanded_date', null, ['widget' => 'single_text'])
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $clan->setSlug($slugger->slug($clan->getName())->lower());
            $clan->setCreatedAt(new \DateTimeImmutable());
            $clan->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($clan);
            $entityManager->flush();

            return $this->redirectToRoute('app_clan_index');
        }

        return $this->render('clan/new.html.twig', ['form' => $form]);
    }

    #[Route('/clans/{id}/edit', name: 'app_clan_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Clan $clan, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createFormBuilder($clan)
            ->add('name')
            ->add('description')
            ->add('founded_date', null, ['widget' => 'single_text'])
            ->add('disbanded_date', null, ['widget' => 'single_text'])
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $clan->setSlug($slugger->slug($clan->getName())->lower());
            $clan->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->redirectToRoute('app_clan_index');
        }

        return $this->render('clan/edit.html.twig', ['clan' => $clan, 'form' => $form]);
    }

    #[Route('/clans/{id}', name: 'app_clan_delete', methods: ['POST'])]
    public function delete(Request $request, Clan $clan, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$clan->getId(), $request->request->get('_token'))) {
            $entityManager->remove($clan);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_clan_index');
    }
}

