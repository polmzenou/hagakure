<?php

namespace App\Entity;

use App\Repository\LocationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $region = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 20)]
    private ?string $latitude = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 20, scale: 20)]
    private ?string $longitude = null;

    /**
     * @var Collection<int, Battle>
     */
    #[ORM\OneToMany(targetEntity: Battle::class, mappedBy: 'location_id')]
    private Collection $battles;

    public function __construct()
    {
        $this->battles = new ArrayCollection();
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

    public function getRegion(): ?string
    {
        return $this->region;
    }

    public function setRegion(string $region): static
    {
        $this->region = $region;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(string $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(string $longitude): static
    {
        $this->longitude = $longitude;

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
            $battle->setLocationId($this);
        }

        return $this;
    }

    public function removeBattle(Battle $battle): static
    {
        if ($this->battles->removeElement($battle)) {
            // set the owning side to null (unless already changed)
            if ($battle->getLocationId() === $this) {
                $battle->setLocationId(null);
            }
        }

        return $this;
    }
}
