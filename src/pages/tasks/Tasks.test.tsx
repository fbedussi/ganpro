import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'

import 'fake-indexeddb/auto'
import { Project } from '../../model/project'
import { _Tasks } from './Tasks'
import { Task } from '../../model/task'

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = jest.fn(function mock(this: HTMLDialogElement) {
    this.open = true
  })
})

describe('tasks page', () => {
  const project: Project = {
    id: 1,
    name: 'proj1',
  }

  const tasks: Task[] = [
    {
      id: 1,
      projId: 1,
      name: 'task1',
      startDate: new Date(),
      length: 1,
      assignee: 'me',
      dependenciesId: [],
    },
    {
      id: 2,
      projId: 1,
      name: 'task2',
      startDate: new Date(),
      length: 2,
      assignee: 'me',
      dependenciesId: [],
    },
  ]

  it('displays the title', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getByText(/tasks/i)).toBeInTheDocument()
  })

  it('displays the project name', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getByText(project.name)).toBeInTheDocument()
  })

  it('displays the tasks', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getAllByText(tasks[0].name).length > 0).toBe(true)
    expect(screen.getAllByText(tasks[1].name).length > 0).toBe(true)
  })

  it('displays a new task input', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getByTestId('new-task-input')).toBeInTheDocument()
  })

  it('displays a save task button', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getByTestId('add-task-btn')).toBeInTheDocument()
  })

  it('the add task button is disabled until the new project input is blank', async () => {
    const user = userEvent.setup()
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} />)
    expect(screen.getByTestId('add-task-btn')).toBeDisabled()
    await user.type(screen.getByTestId('new-task-input'), 'new task')
    expect(screen.getByTestId('add-task-btn')).toBeEnabled()
  })

  it('the save new task button opens the task details', async () => {
    const user = userEvent.setup()
    const saveNewTask = jest.fn()
    render(<_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} />)
    await user.type(screen.getByTestId('new-task-input'), 'new task')

    expect(screen.getByTestId('task-details-form')).not.toBeVisible()
    await user.click(screen.getByTestId('add-task-btn'))
    expect(screen.getByTestId('task-details-form')).toBeVisible()
  })

  describe('adding a new task', () => {
    it('the new task input is cleared out', async () => {
      const user = userEvent.setup()
      const saveNewTask = jest.fn()
      render(<_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} />)
      const newTaskInput = screen.getByTestId('new-task-input') as HTMLInputElement
      await user.type(newTaskInput, 'new task')
      await user.click(screen.getByTestId('add-task-btn'))
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(newTaskInput?.value).toBe('')
    })

    it('the add new task button is disabled', async () => {
      const user = userEvent.setup()
      const saveNewTask = jest.fn()
      render(<_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} />)
      const saveTaskButton = screen.getByTestId('add-task-btn') as HTMLButtonElement
      await user.type(screen.getByTestId('new-task-input'), 'new task')
      await user.click(saveTaskButton)
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(saveTaskButton).toBeDisabled()
    })

    it('the dialog is closed', async () => {
      const user = userEvent.setup()
      const saveNewTask = jest.fn()
      render(<_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} />)
      await user.type(screen.getByTestId('new-task-input'), 'new task')
      await user.click(screen.getByTestId('add-task-btn'))
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))
      expect(screen.getByTestId('task-details-form')).not.toBeVisible()
    })
  })
})
