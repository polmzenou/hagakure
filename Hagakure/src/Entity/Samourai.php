<?php

namespace App\Entity;

use App\Repository\SamouraiRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SamouraiRepository::class)]
class Samourai
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $birth_date = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $death_date = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $description = null;

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
     * @var Collection<int, Weapon>
     */
    #[ORM\ManyToMany(targetEntity: Weapon::class, inversedBy: 'samourais')]
    private Collection $weapon;

    #[ORM\ManyToOne(inversedBy: 'samourais')]
    private ?Clan $clan_id = null;

    /**
     * @var Collection<int, Style>
     */
    #[ORM\ManyToMany(targetEntity: Style::class, inversedBy: 'samourais')]
    private Collection $style_id;

    /**
     * @var Collection<int, Battle>
     */
    #[ORM\ManyToMany(targetEntity: Battle::class, inversedBy: 'samourais')]
    private Collection $battle_id;

    public function __construct()
    {
        $this->weapon = new ArrayCollection();
        $this->style_id = new ArrayCollection();
        $this->battle_id = new ArrayCollection();
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

    public function getBirthDate(): ?\DateTime
    {
        return $this->birth_date;
    }

    public function setBirthDate(?\DateTime $birth_date): static
    {
        $this->birth_date = $birth_date;

        return $this;
    }

    public function getDeathDate(): ?\DateTime
    {
        return $this->death_date;
    }

    public function setDeathDate(?\DateTime $death_date): static
    {
        $this->death_date = $death_date;

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
     * @return Collection<int, Weapon>
     */
    public function getWeapon(): Collection
    {
        return $this->weapon;
    }

    public function addWeapon(Weapon $weapon): static
    {
        if (!$this->weapon->contains($weapon)) {
            $this->weapon->add($weapon);
        }

        return $this;
    }

    public function removeWeapon(Weapon $weapon): static
    {
        $this->weapon->removeElement($weapon);

        return $this;
    }

    public function getClanId(): ?Clan
    {
        return $this->clan_id;
    }

    public function setClanId(?Clan $clan_id): static
    {
        $this->clan_id = $clan_id;

        return $this;
    }

    /**
     * @return Collection<int, Style>
     */
    public function getStyleId(): Collection
    {
        return $this->style_id;
    }

    public function addStyleId(Style $styleId): static
    {
        if (!$this->style_id->contains($styleId)) {
            $this->style_id->add($styleId);
        }

        return $this;
    }

    public function removeStyleId(Style $styleId): static
    {
        $this->style_id->removeElement($styleId);

        return $this;
    }

    /**
     * @return Collection<int, Battle>
     */
    public function getBattleId(): Collection
    {
        return $this->battle_id;
    }

    public function addBattleId(Battle $battleId): static
    {
        if (!$this->battle_id->contains($battleId)) {
            $this->battle_id->add($battleId);
        }

        return $this;
    }

    public function removeBattleId(Battle $battleId): static
    {
        $this->battle_id->removeElement($battleId);

        return $this;
    }
}
