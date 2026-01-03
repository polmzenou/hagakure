<?php

namespace App\Entity;

use App\Repository\BattleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BattleRepository::class)]
class Battle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column]
    private ?\DateTime $date = null;

    #[ORM\ManyToOne(inversedBy: 'battles')]
    private ?Location $location_id = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\ManyToOne(inversedBy: 'battles')]
    private ?Clan $winner_clan_id = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $source_url = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    /**
     * @var Collection<int, Timeline>
     */
    #[ORM\OneToMany(targetEntity: Timeline::class, mappedBy: 'battle_id')]
    private Collection $timelines;

    /**
     * @var Collection<int, Samourai>
     */
    #[ORM\ManyToMany(targetEntity: Samourai::class, mappedBy: 'battle_id')]
    private Collection $samourais;

    public function __construct()
    {
        $this->timelines = new ArrayCollection();
        $this->samourais = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

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

    public function getLocationId(): ?Location
    {
        return $this->location_id;
    }

    public function setLocationId(?Location $location_id): static
    {
        $this->location_id = $location_id;

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

    public function getWinnerClanId(): ?Clan
    {
        return $this->winner_clan_id;
    }

    public function setWinnerClanId(?Clan $winner_clan_id): static
    {
        $this->winner_clan_id = $winner_clan_id;

        return $this;
    }

    public function getSourceUrl(): ?string
    {
        return $this->source_url;
    }

    public function setSourceUrl(?string $source_url): static
    {
        $this->source_url = $source_url;

        return $this;
    }

    public function getImage(): ?string
    {
        return $this->image;
    }

    public function setImage(?string $image): static
    {
        $this->image = $image;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

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
     * @return Collection<int, Timeline>
     */
    public function getTimelines(): Collection
    {
        return $this->timelines;
    }

    public function addTimeline(Timeline $timeline): static
    {
        if (!$this->timelines->contains($timeline)) {
            $this->timelines->add($timeline);
            $timeline->setBattleId($this);
        }

        return $this;
    }

    public function removeTimeline(Timeline $timeline): static
    {
        if ($this->timelines->removeElement($timeline)) {
            // set the owning side to null (unless already changed)
            if ($timeline->getBattleId() === $this) {
                $timeline->setBattleId(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Samourai>
     */
    public function getSamourais(): Collection
    {
        return $this->samourais;
    }

    public function addSamourai(Samourai $samourai): static
    {
        if (!$this->samourais->contains($samourai)) {
            $this->samourais->add($samourai);
            $samourai->addBattleId($this);
        }

        return $this;
    }

    public function removeSamourai(Samourai $samourai): static
    {
        if ($this->samourais->removeElement($samourai)) {
            $samourai->removeBattleId($this);
        }

        return $this;
    }
}
