import { test, expect } from '@playwright/test'
import { addTask } from './helpers'

test.beforeEach(async ({ page }) => {
  const proj1 = 'proj1'

  await page.goto('/ganpro/')

  await page.fill('[data-testid="new-project-input"]', proj1)
  await page.click('[data-testid="save-project-btn"]')

  await page.getByText(proj1).click()

  await addTask(page, {
    name: 'task1',
    startDate: '2024-04-08',
    length: '1',
    assignee: 'foo',
    completed: true,
  })

  await addTask(page, {
    name: 'task2',
    startDate: '2024-04-09',
    length: '1',
    assignee: 'foo',
  })
})

test.describe('Project analytics', () => {
  test('Click on the analytics button opens the analytics', async ({ page }) => {
    await page.getByTestId('analytics-button').click()

    await expect(page.getByTestId('analytics')).toBeVisible()
  })
})
