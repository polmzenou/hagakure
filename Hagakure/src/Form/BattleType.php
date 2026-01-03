<?php

namespace App\Form;

use App\Entity\Battle;
use App\Entity\Clan;
use App\Entity\Location;
use App\Entity\Samourai;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class BattleType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('date')
            ->add('description')
            ->add('source_url')
            ->add('image')
            ->add('slug')
            ->add('created_at', null, [
                'widget' => 'single_text',
            ])
            ->add('updated_at', null, [
                'widget' => 'single_text',
            ])
            ->add('location_id', EntityType::class, [
                'class' => Location::class,
                'choice_label' => 'id',
            ])
            ->add('winner_clan_id', EntityType::class, [
                'class' => Clan::class,
                'choice_label' => 'id',
            ])
            ->add('samourais', EntityType::class, [
                'class' => Samourai::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Battle::class,
        ]);
    }
}
