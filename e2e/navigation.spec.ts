import { test, expect } from '@playwright/test'
import { headerNav } from './helpers/auth'

test.describe.configure({ mode: 'serial' })

test.describe('Navigation publique', () => {
  test('affiche la page d’accueil avec le titre principal', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', {
        name: "L'encyclopédie interactive du Japon féodal",
      }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: 'Se connecter' })).toBeVisible()
  })

  test('navigue vers les pages encyclopédiques via le header', async ({ page }) => {
    await page.goto('/')
    const nav = headerNav(page)

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/samourais') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      nav.getByRole('link', { name: 'Samourais' }).click(),
    ])
    await expect(page).toHaveURL(/\/samourais/)
    await expect(page.getByRole('heading', { name: 'Les Samourais' })).toBeVisible()

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/clans') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      nav.getByRole('link', { name: 'Clans' }).click(),
    ])
    await expect(page).toHaveURL(/\/clans/)
    await expect(page.getByRole('heading', { name: 'Les Clans' })).toBeVisible()

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/battles') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      nav.getByRole('link', { name: 'Batailles' }).click(),
    ])
    await expect(page).toHaveURL(/\/battles/)
    await expect(page.locator('.page-title')).toBeVisible()

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/weapons') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      nav.getByRole('link', { name: 'Armes' }).click(),
    ])
    await expect(page).toHaveURL(/\/weapons/)
    await expect(page.locator('.page-title')).toBeVisible()
  })

  test('affiche la timeline et la carte', async ({ page }) => {
    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/timeline') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      page.goto('/timeline'),
    ])
    await expect(page.getByRole('heading', { name: 'Frise Chronologique' })).toBeVisible()

    await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes('/api/locations') &&
          res.request().method() === 'GET' &&
          res.ok(),
      ),
      page.goto('/map'),
    ])
    await expect(page.locator('.leaflet-container')).toBeVisible({ timeout: 15_000 })
  })

  test('la liste des samouraïs charge les données API', async ({ page }) => {
    const apiResponse = page.waitForResponse(
      (res) =>
        res.url().includes('/api/samourais') && res.request().method() === 'GET',
    )

    await page.goto('/samourais')
    const response = await apiResponse

    expect(response.ok()).toBeTruthy()
    await expect(page.getByRole('heading', { name: 'Les Samourais' })).toBeVisible()
    await expect(page.locator('.results-info')).toContainText(/samouraï/i)
  })
})
