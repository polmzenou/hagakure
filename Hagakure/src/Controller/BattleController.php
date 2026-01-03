<?php

namespace App\Controller;

use App\Entity\Battle;
use App\Repository\BattleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class BattleController extends AbstractController
{
    #[Route('/battles', name: 'app_battle_index')]
    public function index(BattleRepository $repository): Response
    {
        return $this->render('battle/index.html.twig', ['battles' => $repository->findAll()]);
    }

    #[Route('/battles/new', name: 'app_battle_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $battle = new Battle();
        $form = $this->createFormBuilder($battle)
            ->add('name')
            ->add('description')
            ->add('date', null, ['widget' => 'single_text'])
            ->add('source_url')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $battle->setSlug($slugger->slug($battle->getName())->lower());
            $battle->setCreatedAt(new \DateTimeImmutable());
            $battle->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($battle);
            $entityManager->flush();

            return $this->redirectToRoute('app_battle_index');
        }

        return $this->render('battle/new.html.twig', ['form' => $form]);
    }

    #[Route('/battles/{id}/edit', name: 'app_battle_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Battle $battle, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createFormBuilder($battle)
            ->add('name')
            ->add('description')
            ->add('date', null, ['widget' => 'single_text'])
            ->add('source_url')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $battle->setSlug($slugger->slug($battle->getName())->lower());
            $battle->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->redirectToRoute('app_battle_index');
        }

        return $this->render('battle/edit.html.twig', ['battle' => $battle, 'form' => $form]);
    }

    #[Route('/battles/{id}', name: 'app_battle_delete', methods: ['POST'])]
    public function delete(Request $request, Battle $battle, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$battle->getId(), $request->request->get('_token'))) {
            $entityManager->remove($battle);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_battle_index');
    }
}

