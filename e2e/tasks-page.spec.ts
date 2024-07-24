import { test, expect } from '@playwright/test'
import { addTask } from './helpers'

test.beforeEach(async ({ page }) => {
  const proj1 = 'proj1'

  await page.goto('/ganpro/')

  await page.fill('[data-testid="new-project-input"]', proj1)
  await page.click('[data-testid="save-project-btn"]')

  await page.getByText(proj1).click()
})

test.describe('Add a task to a project', () => {
  test('Adds a task', async ({ page }) => {
    await addTask(page, { name: 'task1', startDate: '2024-04-08', length: '3', assignee: 'foo' })

    await expect(page.getByTestId('task-task1')).toBeVisible()
  })
})

test.describe('Show the calendar', () => {
  test('The calendar show the the day of the earlier task', async ({ page }) => {
    await addTask(page, {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    })

    await expect(page.getByTestId('2024-04-04')).toBeVisible()
  })

  test('The calendar has a taskbar for every task', async ({ page }) => {
    await addTask(page, {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    })
    await expect(page.getByTestId(/task-\d+_bar/)).toBeVisible()
  })
})

test.describe('Open Task details', () => {
  test('opens the modal', async ({ page }) => {
    await addTask(page, {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    })
    await page.getByTestId('task-task1').click()
    await expect(page.getByRole('dialog')).toBeVisible()
  })

  test('the modal is populated with task data', async ({ page }) => {
    const task = {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    }
    await addTask(page, task)

    await page.getByTestId('task-task1').click()

    await expect(page.getByLabel(/start date/i)).toHaveValue(task.startDate)
    await expect(page.getByLabel(/length/i)).toHaveValue(task.length)
    await expect(page.getByLabel(/assignee/i)).toHaveValue(task.assignee)
  })

  test('reopens the task details form', async ({ page }) => {
    await addTask(page, {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    })

    await page.getByTestId('task-task1').click()
    await expect(page.getByTestId('task-details-form')).toBeVisible()

    await page.locator('#task-data [data-testid="modal-close-button"]').click()
    await expect(page.getByTestId('task-details-form')).not.toBeVisible()

    await page.getByTestId('task-task1').click()
    await expect(page.getByTestId('task-details-form')).toBeVisible()
  })
})

test.describe('updates a task', () => {
  test('updates the task data, after the task update the modal is closed and can be reopened', async ({
    page,
  }) => {
    const task1Name = 'task1'

    await addTask(page, {
      name: task1Name,
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    })

    await page.getByTestId('task-task1').click()

    await page.getByLabel(/name/i).clear()
    await page.getByLabel(/name/i).fill(task1Name)
    await page.locator('button[type="submit"]').click()

    await expect(page.getByTestId('task-details-form')).not.toBeVisible()

    await page.getByTestId('task-task1').click()

    await expect(page.getByTestId('task-details-form')).toBeVisible()
  })
})

test.describe('back button', () => {
  test('leads to the home page', async ({ page }) => {
    await page.getByTestId('back-button').click()
    await expect(page).toHaveURL('/ganpro')
  })
})

test.describe('task constraints', () => {
  test('cannot start a task in a non working day', async ({ page }) => {
    await page.getByTestId('new-task-input').fill('task4')
    await page.getByTestId('add-task-btn').click()
    const startDate = page.getByLabel(/start date/i)
    await startDate.fill('2024-04-06')
    await page.getByLabel(/length/i).click()
    await expect(page.locator('input:invalid')).toBeVisible()

    const validationMessage = await startDate.evaluate(element => {
      const input = element as HTMLInputElement
      return input.validationMessage
    })

    expect(validationMessage).toBe('Start date cannot be a weekend day')
  })

  test('cannot start a task before the task it depends on ends', async ({ page }) => {
    const task1 = {
      name: 'task1',
      startDate: '2024-04-08',
      length: '3',
      assignee: 'foo',
    }
    await addTask(page, task1)

    await expect(page.getByTestId('task-details-form')).not.toBeVisible()

    await page.getByTestId('new-task-input').fill('task2')
    await page.getByTestId('add-task-btn').click()
    await page.getByLabel(/start date/i).fill('2024-04-03')
    await page.getByLabel(/length/i).fill('1')
    await page.getByLabel(/dependencies/i).selectOption(task1.name)
    await page.getByLabel(/length/i).click()
    await expect(page.locator('select:invalid')).toBeVisible()
    const validationMessage = await page.locator('select:invalid').evaluate(element => {
      const input = element as HTMLInputElement
      return input.validationMessage
    })

    expect(validationMessage).toBe(`${task1.name} ends after the task starts`)
  })
})

test.describe('auto move dependent task', () => {
  test('show an alert when a task end date is changed and is after the start date of a dependant task', async ({
    page,
  }) => {
    const task1 = {
      name: 'task1',
      startDate: '2024-04-08',
      length: '1',
      assignee: 'foo',
    }
    await addTask(page, task1)

    await expect(page.getByTestId('task-details-form')).not.toBeVisible()

    const task2 = {
      name: 'task2',
      startDate: '2024-04-09',
      length: '1',
      assignee: 'foo',
      dependency: task1.name,
    }
    await addTask(page, task2)

    await page.getByTestId('task-task1').click()
    await page.getByLabel(/length/i).fill('3')
    await page.locator('button[type="submit"]').click()
    await expect(page.getByTestId('dependency-warning')).toBeVisible()
  })
})

test('delete a task', async ({ page }) => {
  const task1 = {
    name: 'task1',
    startDate: '2024-04-08',
    length: '1',
    assignee: 'foo',
  }
  await addTask(page, task1)

  await expect(page.getByTestId('task-task1')).toBeVisible()

  await page.getByTestId('delete-task-btn').click()

  await expect(page.getByTestId('confirm-delete-task-modal')).toBeVisible()

  await page.getByTestId('ok-btn').click()

  await expect(page.getByTestId('task-task1')).not.toBeVisible()
})
