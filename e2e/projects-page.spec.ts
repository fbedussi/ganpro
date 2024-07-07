import { test, expect } from '@playwright/test'

const proj1 = 'proj1'
const proj2 = 'proj2'

test.beforeEach(async ({ page }) => {
  await page.goto('/ganpro/')

  await page.fill('[data-testid="new-project-input"]', proj1)
  await page.click('[data-testid="save-project-btn"]')

  await page.fill('[data-testid="new-project-input"]', proj2)
  await page.click('[data-testid="save-project-btn"]')
})

test.describe('Listing Projects', () => {
  test('shows saved projects', async ({ page }) => {
    await page.goto('/ganpro/')

    await expect(page.getByText(proj1)).toBeVisible()
    await expect(page.getByText(proj2)).toBeVisible()
  })
})

test.describe('Add a project', () => {
  test('Adds a project', async ({ page }) => {
    await page.goto('/ganpro/')
    await page.fill('[data-testid="new-project-input"]', 'proj3')
    await page.click('[data-testid="save-project-btn"]')

    await expect(page.getByText('proj3')).toBeVisible()
  })
})
