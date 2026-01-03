<?php

namespace App\Controller;

use App\Entity\Samourai;
use App\Repository\SamouraiRepository;
use App\Repository\ClanRepository;
use App\Repository\BattleRepository;
use App\Repository\WeaponRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class SamouraiController extends AbstractController
{
    #[Route('/samourais', name: 'app_samourai_index')]
    public function index(SamouraiRepository $repository): Response
    {
        $samourais = $repository->findAll();
        return $this->render('samourai/index.html.twig', [
            'samourais' => $samourais,
        ]);
    }

    #[Route('/samourais/new', name: 'app_samourai_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger, ClanRepository $clanRepository): Response
    {
        $samourai = new Samourai();
        $form = $this->createFormBuilder($samourai)
            ->add('name')
            ->add('description')
            ->add('birth_date', null, ['widget' => 'single_text'])
            ->add('death_date', null, ['widget' => 'single_text'])
            ->add('source_url')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $samourai->setSlug($slugger->slug($samourai->getName())->lower());
            $samourai->setCreatedAt(new \DateTimeImmutable());
            $samourai->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($samourai);
            $entityManager->flush();

            return $this->redirectToRoute('app_samourai_index');
        }

        return $this->render('samourai/new.html.twig', [
            'form' => $form,
        ]);
    }

    #[Route('/samourais/{id}', name: 'app_samourai_show', methods: ['GET'])]
    public function show(Samourai $samourai): Response
    {
        return $this->render('samourai/show.html.twig', [
            'samourai' => $samourai,
        ]);
    }

    #[Route('/samourais/{id}/edit', name: 'app_samourai_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Samourai $samourai, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createFormBuilder($samourai)
            ->add('name')
            ->add('description')
            ->add('birth_date', null, ['widget' => 'single_text'])
            ->add('death_date', null, ['widget' => 'single_text'])
            ->add('source_url')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $samourai->setSlug($slugger->slug($samourai->getName())->lower());
            $samourai->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->redirectToRoute('app_samourai_index');
        }

        return $this->render('samourai/edit.html.twig', [
            'samourai' => $samourai,
            'form' => $form,
        ]);
    }

    #[Route('/samourais/{id}', name: 'app_samourai_delete', methods: ['POST'])]
    public function delete(Request $request, Samourai $samourai, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$samourai->getId(), $request->request->get('_token'))) {
            $entityManager->remove($samourai);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_samourai_index');
    }
}
