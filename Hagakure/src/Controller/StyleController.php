<?php

namespace App\Controller;

use App\Entity\Style;
use App\Repository\StyleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class StyleController extends AbstractController
{
    #[Route('/styles', name: 'app_style_index')]
    public function index(StyleRepository $repository): Response
    {
        return $this->render('style/index.html.twig', ['styles' => $repository->findAll()]);
    }

    #[Route('/styles/new', name: 'app_style_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $style = new Style();
        $form = $this->createFormBuilder($style)
            ->add('name')
            ->add('description')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $style->setSlug($slugger->slug($style->getName())->lower());
            $style->setCreatedAt(new \DateTimeImmutable());
            $style->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->persist($style);
            $entityManager->flush();

            return $this->redirectToRoute('app_style_index');
        }

        return $this->render('style/new.html.twig', ['form' => $form]);
    }

    #[Route('/styles/{id}/edit', name: 'app_style_edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Style $style, EntityManagerInterface $entityManager, SluggerInterface $slugger): Response
    {
        $form = $this->createFormBuilder($style)
            ->add('name')
            ->add('description')
            ->add('image')
            ->getForm();

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $style->setSlug($slugger->slug($style->getName())->lower());
            $style->setUpdatedAt(new \DateTimeImmutable());
            $entityManager->flush();

            return $this->redirectToRoute('app_style_index');
        }

        return $this->render('style/edit.html.twig', ['style' => $style, 'form' => $form]);
    }

    #[Route('/styles/{id}', name: 'app_style_delete', methods: ['POST'])]
    public function delete(Request $request, Style $style, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$style->getId(), $request->request->get('_token'))) {
            $entityManager->remove($style);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_style_index');
    }
}

