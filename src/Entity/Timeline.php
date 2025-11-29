<?php

namespace App\Entity;

use App\Repository\TimelineRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TimelineRepository::class)]
class Timeline
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?int $year = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTime $date = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'timelines')]
    private ?Battle $battle_id = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    /**
     * @var Collection<int, TimelineEntities>
     */
    #[ORM\OneToMany(targetEntity: TimelineEntities::class, mappedBy: 'timeline_id')]
    private Collection $timelineEntities;

    public function __construct()
    {
        $this->timelineEntities = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getYear(): ?int
    {
        return $this->year;
    }

    public function setYear(int $year): static
    {
        $this->year = $year;

        return $this;
    }

    public function getDate(): ?\DateTime
    {
        return $this->date;
    }

    public function setDate(\DateTime $date): static
    {
        $this->date = $date;

        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getBattleId(): ?Battle
    {
        return $this->battle_id;
    }

    public function setBattleId(?Battle $battle_id): static
    {
        $this->battle_id = $battle_id;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    /**
     * @return Collection<int, TimelineEntities>
     */
    public function getTimelineEntities(): Collection
    {
        return $this->timelineEntities;
    }

    public function addTimelineEntity(TimelineEntities $timelineEntity): static
    {
        if (!$this->timelineEntities->contains($timelineEntity)) {
            $this->timelineEntities->add($timelineEntity);
            $timelineEntity->setTimelineId($this);
        }

        return $this;
    }

    public function removeTimelineEntity(TimelineEntities $timelineEntity): static
    {
        if ($this->timelineEntities->removeElement($timelineEntity)) {
            // set the owning side to null (unless already changed)
            if ($timelineEntity->getTimelineId() === $this) {
                $timelineEntity->setTimelineId(null);
            }
        }

        return $this;
    }
}
