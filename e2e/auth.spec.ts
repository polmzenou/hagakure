import { test, expect } from '@playwright/test'
import { loginViaUi, logoutViaUi, TEST_USERS } from './helpers/auth'
import { requireUserFixtures } from './helpers/fixtures'

test.describe.configure({ mode: 'serial' })

test.describe('Authentification', () => {
  test.beforeEach(async ({ page }) => {
    await logoutViaUi(page)
  })

  test('affiche le formulaire de connexion', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByText('Bienvenue sur Hagakure')).toBeVisible()
    await expect(page.getByLabel('Email')).toBeVisible()
    await expect(page.getByLabel('Mot de passe')).toBeVisible()
    await expect(page.locator('form.login-form button[type="submit"]')).toHaveText(
      'Se connecter',
    )
  })

  test('refuse des identifiants invalides', async ({ page }) => {
    await page.goto('/login')
    await page.getByLabel('Email').fill('inexistant@hagakure.fr')
    await page.getByLabel('Mot de passe').fill('mauvais-mot-de-passe')

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/login')),
      page.locator('form.login-form button[type="submit"]').click(),
    ])

    expect(response.status()).toBe(401)
    await expect(page).toHaveURL(/\/login/)
  })
})

test.describe('Authentification (fixtures requises)', () => {
  test.beforeEach(async ({ page, request }) => {
    await requireUserFixtures(request)
    await logoutViaUi(page)
  })

  test('connecte un utilisateur standard', async ({ page }) => {
    await loginViaUi(page, TEST_USERS.user.email, TEST_USERS.user.password)

    await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mon compte' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back Office' })).not.toBeVisible()
  })

  test('connecte un administrateur avec accès back office', async ({ page }) => {
    await loginViaUi(page, TEST_USERS.admin.email, TEST_USERS.admin.password)

    await expect(page.getByRole('link', { name: 'Back Office' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Styles de combat' })).toBeVisible()
  })

  test('redirige un visiteur non-admin vers /forbidden sur une route protégée', async ({
    page,
  }) => {
    await loginViaUi(page, TEST_USERS.user.email, TEST_USERS.user.password)

    await page.goto('/users', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/forbidden/, { timeout: 10_000 })
    await expect(page.getByRole('heading', { name: 'Accès Refusé' })).toBeVisible()
  })

  test('permet à l’admin d’ouvrir le back office', async ({ page }) => {
    await loginViaUi(page, TEST_USERS.admin.email, TEST_USERS.admin.password)

    await Promise.all([
      page.waitForResponse(
        (res) => res.url().includes('/api/users') && res.ok(),
      ),
      page.getByRole('link', { name: 'Back Office' }).click(),
    ])
    await expect(page).toHaveURL(/\/users/)
    await expect(
      page.getByRole('heading', { name: 'Gestion des utilisateurs' }),
    ).toBeVisible({ timeout: 15_000 })
  })
})
