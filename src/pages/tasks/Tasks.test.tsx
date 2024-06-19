import { render, screen } from '../../test-utils'

import 'fake-indexeddb/auto'
import { Project } from '../../model/project'
import { _Tasks } from './Tasks'
import { Task } from '../../model/task'
import React from 'react'

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
      endDate: new Date(),
      length: 1,
      effectiveLength: 1,
      assignee: 'me',
      dependenciesId: [],
      color: 'red',
    },
    {
      id: 2,
      projId: 1,
      name: 'task2',
      startDate: new Date(),
      endDate: new Date(),
      length: 2,
      effectiveLength: 2,
      assignee: 'me',
      dependenciesId: [],
      color: 'green',
    },
  ]

  it('displays the title', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getByText('proj1 tasks')).toBeInTheDocument()
  })

  it('displays the project name', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getByText(new RegExp(project.name, 'i'))).toBeInTheDocument()
  })

  it('displays the tasks', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getAllByText(tasks[0].name).length > 0).toBe(true)
    expect(screen.getAllByText(tasks[1].name).length > 0).toBe(true)
  })

  it('displays a new task input', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getByTestId('new-task-input')).toBeInTheDocument()
  })

  it('displays a save task button', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getByTestId('add-task-btn')).toBeInTheDocument()
  })

  it('the add task button is disabled until the new project input is blank', async () => {
    const { user } = render(
      <_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />,
    )
    expect(screen.getByTestId('add-task-btn')).toBeDisabled()
    await user.type(screen.getByTestId('new-task-input'), 'new task')
    expect(screen.getByTestId('add-task-btn')).toBeEnabled()
  })

  it('the save new task button opens the task details', async () => {
    const saveNewTask = jest.fn()
    const { user } = render(
      <_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} updateTask={() => {}} />,
    )
    await user.type(screen.getByTestId('new-task-input'), 'new task')

    expect(screen.getByTestId('task-details-form')).not.toBeVisible()
    await user.click(screen.getByTestId('add-task-btn'))
    expect(screen.getByTestId('task-details-form')).toBeVisible()
  })

  describe('adding a new task', () => {
    it('the new task input is cleared out', async () => {
      const saveNewTask = jest.fn()
      const { user } = render(
        <_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} updateTask={() => {}} />,
      )
      const newTaskInput = screen.getByTestId('new-task-input') as HTMLInputElement
      await user.type(newTaskInput, 'new task')
      await user.click(screen.getByTestId('add-task-btn'))
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(newTaskInput?.value).toBe('')
    })

    it('the add new task button is disabled', async () => {
      const saveNewTask = jest.fn()
      const { user } = render(
        <_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} updateTask={() => {}} />,
      )
      const saveTaskButton = screen.getByTestId('add-task-btn') as HTMLButtonElement
      await user.type(screen.getByTestId('new-task-input'), 'new task')
      await user.click(saveTaskButton)
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))

      expect(saveTaskButton).toBeDisabled()
    })

    it('the dialog is closed', async () => {
      const saveNewTask = jest.fn()
      const { user } = render(
        <_Tasks project={project} tasks={tasks} saveNewTask={saveNewTask} updateTask={() => {}} />,
      )
      await user.type(screen.getByTestId('new-task-input'), 'new task')
      await user.click(screen.getByTestId('add-task-btn'))
      await user.type(screen.getByLabelText(/start date/i), '2024-04-04')
      await user.type(screen.getByLabelText(/length/i), '2')
      await user.click(screen.getByRole('button', { name: /save/i }))
      expect(screen.getByTestId('task-details-form')).not.toBeVisible()
    })
  })

  it('display the calendar', () => {
    render(<_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />)
    expect(screen.getByTestId('calendar')).toBeInTheDocument()
  })

  describe('task details', () => {
    it('opens the task details form', async () => {
      const { user } = render(
        <_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />,
      )
      await user.click(screen.getByTestId(`task-${tasks[0].name}`))
      expect(screen.getByTestId('task-details-form')).toBeVisible()
    })

    it('the task details form is populated with task data', async () => {
      const { user } = render(
        <_Tasks project={project} tasks={tasks} saveNewTask={jest.fn()} updateTask={() => {}} />,
      )
      await user.click(screen.getByTestId(`task-${tasks[0].name}`))
      expect(screen.getByTestId('task-details-form')).toBeVisible()
    })
  })
})
