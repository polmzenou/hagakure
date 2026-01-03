<?php

namespace App\Form;

use App\Entity\Battle;
use App\Entity\Clan;
use App\Entity\Samourai;
use App\Entity\Style;
use App\Entity\Weapon;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class SamouraiType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('birth_date')
            ->add('death_date')
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
            ->add('weapon', EntityType::class, [
                'class' => Weapon::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
            ->add('clan_id', EntityType::class, [
                'class' => Clan::class,
                'choice_label' => 'id',
            ])
            ->add('style_id', EntityType::class, [
                'class' => Style::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
            ->add('battle_id', EntityType::class, [
                'class' => Battle::class,
                'choice_label' => 'id',
                'multiple' => true,
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Samourai::class,
        ]);
    }
}
