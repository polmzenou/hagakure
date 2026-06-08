import { test, expect } from '@playwright/test'
import { TEST_USERS } from './helpers/auth'
import { requireUserFixtures } from './helpers/fixtures'

const API_BASE = process.env.PLAYWRIGHT_API_URL ?? 'http://127.0.0.1:8000'

test.describe('API Symfony (contrat minimal)', () => {
  test('GET /api/samourais renvoie un tableau JSON', async ({ request }) => {
    const response = await request.get(`${API_BASE}/api/samourais`)

    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(Array.isArray(body)).toBe(true)
  })

  test('POST /api/login accepte les identifiants admin des fixtures', async ({
    request,
  }) => {
    await requireUserFixtures(request)
    const response = await request.post(`${API_BASE}/api/login`, {
      data: {
        email: TEST_USERS.admin.email,
        password: TEST_USERS.admin.password,
      },
    })

    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.token).toBeTruthy()
    expect(body.user.email).toBe(TEST_USERS.admin.email)
    expect(body.user.roles).toContain('ROLE_ADMIN')
  })

  test('POST /api/login renvoie 401 pour un mot de passe incorrect', async ({
    request,
  }) => {
    const response = await request.post(`${API_BASE}/api/login`, {
      data: {
        email: TEST_USERS.admin.email,
        password: 'mot-de-passe-invalide',
      },
    })

    expect(response.status()).toBe(401)
  })
})
