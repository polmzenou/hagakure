<?php

namespace App\Security;

use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;

class TokenAuthenticator extends AbstractAuthenticator
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function supports(Request $request): ?bool
    {
        return $request->headers->has('Authorization');
    }

    public function authenticate(Request $request): Passport
    {
        $authorizationHeader = $request->headers->get('Authorization');

        if (null === $authorizationHeader) {
            throw new CustomUserMessageAuthenticationException('No API token provided');
        }

        $token = str_replace('Bearer ', '', $authorizationHeader);

        if (empty($token)) {
            throw new CustomUserMessageAuthenticationException('Invalid token');
        }

        try {
            $decoded = base64_decode($token);
            $parts = explode(':', $decoded);
            
            if (count($parts) < 2) {
                throw new CustomUserMessageAuthenticationException('Invalid token format');
            }

            $email = $parts[0];

            return new SelfValidatingPassport(
                new UserBadge($email, function($userIdentifier) {
                    return $this->userRepository->findOneBy(['email' => $userIdentifier]);
                })
            );
        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException('Invalid token');
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        return new JsonResponse([
            'message' => $exception->getMessageKey()
        ], Response::HTTP_UNAUTHORIZED);
    }
}

