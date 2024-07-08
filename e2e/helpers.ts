import { Page } from '@playwright/test'
import { expect } from '@playwright/test'

export const addTask = async (
  page: Page,
  {
    name,
    startDate,
    length,
    assignee,
    dependency,
    completed,
  }: {
    name: string
    startDate: string
    length: string
    assignee: string
    dependency?: string
    completed?: true
  },
) => {
  await page.getByTestId('new-task-input').fill(name)
  await page.getByTestId('add-task-btn').click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.getByLabel(/start date/i).fill(startDate)
  await page.getByLabel(/length/i).fill(length)
  await page.getByLabel(/assignee/i).fill(assignee)

  if (dependency) {
    await page.getByLabel(/dependencies/i).selectOption(dependency)
  }

  if (completed) {
    await page.getByLabel(/completed/i).click()
  }

  await page.click('button[type="submit"]')

  await expect(page.getByTestId('task-details-form')).not.toBeVisible()
}
