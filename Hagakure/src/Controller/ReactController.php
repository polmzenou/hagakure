<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ReactController extends AbstractController
{
    #[Route('/', name: 'app_react_home')]
    #[Route('/samourais/{reactRoute}', name: 'app_react_samourais', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/clans/{reactRoute}', name: 'app_react_clans', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/battles/{reactRoute}', name: 'app_react_battles', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/weapons/{reactRoute}', name: 'app_react_weapons', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/styles/{reactRoute}', name: 'app_react_styles', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/locations/{reactRoute}', name: 'app_react_locations', requirements: ['reactRoute' => '.*'], defaults: ['reactRoute' => null])]
    #[Route('/events/new', name: 'app_react_events_new')]
    #[Route('/events/{id}/edit', name: 'app_react_events_edit', requirements: ['id' => '\d+'])]
    #[Route('/users', name: 'app_react_users')]
    #[Route('/users/{reactRoute}', name: 'app_react_users_nested', requirements: ['reactRoute' => '.*'])]
    #[Route('/politique-de-confidentialite', name: 'app_react_privacy')]
    #[Route('/nous-contacter', name: 'app_react_contact')]
    #[Route('/a-propos', name: 'app_react_about')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }
}

