<?php

namespace App\Entity;

use App\Repository\TimelineEntitiesRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TimelineEntitiesRepository::class)]
class TimelineEntities
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'timelineEntities')]
    private ?Timeline $timeline_id = null;

    #[ORM\Column(length: 255)]
    private ?string $entity_type = null;

    #[ORM\Column]
    private ?int $entity_id = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTimelineId(): ?Timeline
    {
        return $this->timeline_id;
    }

    public function setTimelineId(?Timeline $timeline_id): static
    {
        $this->timeline_id = $timeline_id;

        return $this;
    }

    public function getEntityType(): ?string
    {
        return $this->entity_type;
    }

    public function setEntityType(string $entity_type): static
    {
        $this->entity_type = $entity_type;

        return $this;
    }

    public function getEntityId(): ?int
    {
        return $this->entity_id;
    }

    public function setEntityId(int $entity_id): static
    {
        $this->entity_id = $entity_id;

        return $this;
    }
}
