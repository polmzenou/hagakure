<?php

namespace App\Controller\Api;

use App\Entity\Style;
use App\Repository\StyleRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api/styles', name: 'api_style_')]
class StyleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private StyleRepository $repository,
        private SluggerInterface $slugger
    ) {}

    #[Route('', name: 'index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $styles = $this->repository->findAll();
        $data = [];

        foreach ($styles as $style) {
            $data[] = $this->serializeStyle($style);
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse
    {
        $style = $this->repository->find($id);

        if (!$style) {
            return $this->json(['error' => 'Style not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializeStyle($style));
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $style = new Style();
        $style->setName($data['name'] ?? '');
        $style->setDescription($data['description'] ?? '');
        $style->setSlug($this->slugger->slug($data['name'] ?? '')->lower());
        
        if (isset($data['image'])) {
            $style->setImage($data['image']);
        }

        $style->setCreatedAt(new \DateTimeImmutable());
        $style->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->persist($style);
        $this->entityManager->flush();

        return $this->json($this->serializeStyle($style), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'update', methods: ['PUT', 'PATCH'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $style = $this->repository->find($id);

        if (!$style) {
            return $this->json(['error' => 'Style not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['name'])) {
            $style->setName($data['name']);
            $style->setSlug($this->slugger->slug($data['name'])->lower());
        }
        if (isset($data['description'])) {
            $style->setDescription($data['description']);
        }
        if (isset($data['image'])) {
            $style->setImage($data['image']);
        }

        $style->setUpdatedAt(new \DateTimeImmutable());

        $this->entityManager->flush();

        return $this->json($this->serializeStyle($style));
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $style = $this->repository->find($id);

        if (!$style) {
            return $this->json(['error' => 'Style not found'], Response::HTTP_NOT_FOUND);
        }

        $this->entityManager->remove($style);
        $this->entityManager->flush();

        return $this->json(['message' => 'Style deleted successfully']);
    }

    private function serializeStyle(Style $style): array
    {
        return [
            'id' => $style->getId(),
            'name' => $style->getName(),
            'description' => $style->getDescription(),
            'image' => $style->getImage(),
            'slug' => $style->getSlug(),
            'samourais_count' => $style->getSamourais()->count(),
            'created_at' => $style->getCreatedAt()?->format('Y-m-d H:i:s'),
            'updated_at' => $style->getUpdatedAt()?->format('Y-m-d H:i:s'),
        ];
    }
}

