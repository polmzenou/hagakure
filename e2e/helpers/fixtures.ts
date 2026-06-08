import { test, type APIRequestContext } from '@playwright/test'
import { TEST_USERS } from './auth'

const API_BASE = process.env.PLAYWRIGHT_API_URL ?? 'http://127.0.0.1:8000'

let fixturesReady: boolean | null = null

async function canLogin(
  request: APIRequestContext,
  email: string,
  password: string,
): Promise<boolean> {
  const response = await request.post(`${API_BASE}/api/login`, {
    data: { email, password },
  })
  return response.ok()
}

/**
 * Vérifie que l’admin de test existe ; crée l’utilisateur standard via /api/register si besoin.
 */
export async function requireUserFixtures(
  request: APIRequestContext,
): Promise<void> {
  if (fixturesReady !== null) {
    if (!fixturesReady) {
      test.skip(
        true,
        'Compte admin introuvable : `php bin/console app:create-admin admin@hagakure.fr admin123` dans Hagakure/',
      )
    }
    return
  }

  const adminOk = await canLogin(
    request,
    TEST_USERS.admin.email,
    TEST_USERS.admin.password,
  )

  if (!adminOk) {
    fixturesReady = false
    test.skip(
      true,
      'Compte admin introuvable : `php bin/console app:create-admin admin@hagakure.fr admin123` dans Hagakure/',
    )
    return
  }

  const userOk = await canLogin(
    request,
    TEST_USERS.user.email,
    TEST_USERS.user.password,
  )

  if (!userOk) {
    await request.post(`${API_BASE}/api/register`, {
      data: {
        email: TEST_USERS.user.email,
        password: TEST_USERS.user.password,
      },
    })
  }

  fixturesReady = true
}
