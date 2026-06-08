import type { Page } from '@playwright/test'

export const TEST_USERS = {
  admin: {
    email: process.env.E2E_ADMIN_EMAIL ?? 'admin@hagakure.fr',
    password: process.env.E2E_ADMIN_PASSWORD ?? 'admin123',
  },
  user: {
    email: process.env.E2E_USER_EMAIL ?? 'user1@hagakure.fr',
    password: process.env.E2E_USER_PASSWORD ?? 'user123',
  },
} as const

/** Connexion via l’UI (page /login). */
export async function loginViaUi(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto('/login')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Mot de passe').fill(password)

  await Promise.all([
    page.waitForResponse(
      (res) => res.url().includes('/api/login') && res.ok(),
    ),
    page.locator('form.login-form button[type="submit"]').click(),
  ])

  await page.waitForURL('/')
  await page.waitForLoadState('domcontentloaded')
  await page.getByRole('button', { name: 'Se déconnecter' }).waitFor({
    state: 'visible',
    timeout: 15_000,
  })
}

/** Vide le stockage local (déconnexion côté client). */
export async function logoutViaUi(page: Page): Promise<void> {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  })
}

/** Liens de navigation du header desktop (évite le doublon menu mobile). */
export function headerNav(page: Page) {
  return page.getByRole('banner').locator('nav.main-nav')
}
