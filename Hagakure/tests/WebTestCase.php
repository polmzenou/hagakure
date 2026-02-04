<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class TimelineApiTest extends WebTestCase
{
    public function testTimelineListEndpoint(): void
    {
        $client = static::createClient();
        
        // Faire une requête GET sur /api/timeline
        $client->request('GET', '/api/timeline');
        
        // Vérifier que la réponse est 200 OK
        $this->assertResponseIsSuccessful();
        
        // Vérifier que la réponse est en JSON
        $this->assertResponseHeaderSame('content-type', 'application/json');
        
        // Récupérer la réponse
        $response = $client->getResponse();
        $data = json_decode($response->getContent(), true);
        
        // Vérifier que c'est un tableau
        $this->assertIsArray($data);
        
        // Si des données existent, vérifier la structure
        if (count($data) > 0) {
            $firstItem = $data[0];
            $this->assertArrayHasKey('id', $firstItem);
            $this->assertArrayHasKey('title', $firstItem);
            $this->assertArrayHasKey('type', $firstItem);
        }
    }

    public function testTimelineShowEndpointNotFound(): void
    {
        $client = static::createClient();
        
        // Tester avec un ID qui n'existe probablement pas
        $client->request('GET', '/api/timeline/99999');
        
        // Vérifier que la réponse est 404
        $this->assertResponseStatusCodeSame(404);
    }
}