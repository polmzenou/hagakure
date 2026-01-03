<?php

namespace App\Entity;

use App\Repository\ClanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ClanRepository::class)]
class Clan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $founded_date = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $disbanded_date = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $image = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    /**
     * @var Collection<int, Battle>
     */
    #[ORM\OneToMany(targetEntity: Battle::class, mappedBy: 'winner_clan_id')]
    private Collection $battles;

    /**
     * @var Collection<int, Samourai>
     */
    #[ORM\OneToMany(targetEntity: Samourai::class, mappedBy: 'clan_id')]
    private Collection $samourais;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Samourai $leader_id = null;

    public function __construct()
    {
        $this->battles = new ArrayCollection();
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }

    public function getFoundedDate(): ?\DateTime
    {
        return $this->founded_date;
    }

    public function setFoundedDate(?\DateTime $founded_date): static
    {
        $this->founded_date = $founded_date;

        return $this;
    }

    public function getDisbandedDate(): ?\DateTime
    {
        return $this->disbanded_date;
    }

    public function setDisbandedDate(?\DateTime $disbanded_date): static
    {
        $this->disbanded_date = $disbanded_date;

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
     * @return Collection<int, Battle>
     */
    public function getBattles(): Collection
    {
        return $this->battles;
    }

    public function addBattle(Battle $battle): static
    {
        if (!$this->battles->contains($battle)) {
            $this->battles->add($battle);
            $battle->setWinnerClanId($this);
        }

        return $this;
    }

    public function removeBattle(Battle $battle): static
    {
        if ($this->battles->removeElement($battle)) {
            // set the owning side to null (unless already changed)
            if ($battle->getWinnerClanId() === $this) {
                $battle->setWinnerClanId(null);
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
            $samourai->setClanId($this);
        }

        return $this;
    }

    public function removeSamourai(Samourai $samourai): static
    {
        if ($this->samourais->removeElement($samourai)) {
            // set the owning side to null (unless already changed)
            if ($samourai->getClanId() === $this) {
                $samourai->setClanId(null);
            }
        }

        return $this;
    }

    public function getLeaderId(): ?Samourai
    {
        return $this->leader_id;
    }

    public function setLeaderId(?Samourai $leader_id): static
    {
        $this->leader_id = $leader_id;

        return $this;
    }
}
