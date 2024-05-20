import userEvent from '@testing-library/user-event'
import { Task } from '../../model/task'
import { render, screen } from '../../test-utils'
import TaskData from './TaskData'
import React from 'react'

describe('TaskData', () => {
  it('shows the task fields', () => {
    render(
      <TaskData
        data={{ name: 'task1', projId: 1 }}
        projectTasks={[]}
        saveTask={() => {}}
        updateTask={() => {}}
      />,
    )
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/length/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: /dependencies/i })).toBeInTheDocument()
  })

  it('the dependencies do not have a selected value', () => {
    render(
      <TaskData
        data={{ name: 'task2', projId: 1 }}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={() => {}}
        updateTask={() => {}}
      />,
    )
    const dependencies = screen.getByRole('listbox', {
      name: /dependencies/i,
    }) as HTMLSelectElement
    expect(dependencies.value).toBe('')
  })

  it('multiple dependencies can be selected', () => {
    render(
      <TaskData
        data={{ name: 'task2', projId: 1 }}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={() => {}}
        updateTask={() => {}}
      />,
    )
    const dependencies = screen.getByRole('listbox', {
      name: /dependencies/i,
    }) as HTMLSelectElement
    expect(dependencies.multiple).toBe(true)
  })

  it('has required fields', () => {
    render(
      <TaskData
        data={{ name: 'task1', projId: 1 }}
        projectTasks={[]}
        saveTask={() => {}}
        updateTask={() => {}}
      />,
    )
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).required).toBe(true)
    expect((screen.getByLabelText(/start date/i) as HTMLInputElement).required).toBe(true)
    expect((screen.getByLabelText(/length/i) as HTMLInputElement).required).toBe(true)
  })

  it('saves the task', async () => {
    const saveTask = jest.fn()
    const { user } = render(
      <TaskData
        data={{ name: 'task1', projId: 1 }}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={saveTask}
        updateTask={() => {}}
      />,
    )
    await user.type(screen.getByLabelText(/start date/i), '2024-04-03')
    const lengthInput = screen.getByLabelText(/length/i)
    await user.clear(lengthInput)
    await user.type(lengthInput, '2')
    await user.type(screen.getByLabelText(/assignee/i), 'foo')
    await user.selectOptions(screen.getByRole('listbox', { name: /dependencies/i }), '1')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(saveTask).toHaveBeenCalledWith({
      name: 'task1',
      projId: 1,
      startDate: new Date('2024-04-03'),
      endDate: new Date('2024-04-04'),
      length: 2,
      effectiveLength: 2,
      assignee: 'foo',
      dependenciesId: [1],
      color: expect.stringMatching(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/),
    })
  })

  it('saves the task, calculating the end date considering weekends and holidays', async () => {
    const user = userEvent.setup()

    const saveTask = jest.fn()
    render(
      <TaskData
        data={{ name: 'task1', projId: 1 }}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={saveTask}
        updateTask={() => {}}
      />,
    )
    await user.type(screen.getByLabelText(/start date/i), '2024-04-24')
    const lengthInput = screen.getByLabelText(/length/i)
    await user.clear(lengthInput)
    await user.type(lengthInput, '4')
    await user.type(screen.getByLabelText(/assignee/i), 'foo')
    await user.selectOptions(screen.getByRole('listbox', { name: /dependencies/i }), '1')
    await user.click(screen.getByRole('button', { name: /save/i }))
    expect(saveTask).toHaveBeenCalledWith({
      name: 'task1',
      projId: 1,
      startDate: new Date('2024-04-24'),
      endDate: new Date('2024-04-30'),
      length: 4,
      effectiveLength: 7,
      assignee: 'foo',
      dependenciesId: [1],
      color: expect.stringMatching(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/),
    })
  })

  it('is populated with the task data, if a task is passed', () => {
    const task: Task = {
      id: 1,
      name: 'task1',
      projId: 1,
      startDate: new Date('2024-04-04'),
      endDate: new Date('2024-04-04'),
      assignee: 'foo',
      length: 1,
      effectiveLength: 1,
      dependenciesId: [],
      color: 'red',
    }
    render(<TaskData data={task} projectTasks={[]} saveTask={() => {}} updateTask={() => {}} />)
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).value).toBe(task.name)
    expect((screen.getByLabelText(/start date/i) as HTMLInputElement).value).toBe(
      task.startDate.toISOString().split('T')[0],
    )
    expect((screen.getByLabelText(/length/i) as HTMLInputElement).value).toBe(
      task.length.toString(),
    )
    expect((screen.getByLabelText(/assignee/i) as HTMLInputElement).value).toBe(task.assignee)
  })

  it('updates the task', async () => {
    const task: Task = {
      id: 1,
      name: 'task1',
      projId: 1,
      startDate: new Date('2024-04-04'),
      endDate: new Date('2024-04-04'),
      assignee: 'foo',
      length: 1,
      effectiveLength: 1,
      dependenciesId: [],
      color: 'red',
    }

    const updateTask = jest.fn()
    const { user } = render(
      <TaskData data={task} projectTasks={[]} saveTask={() => {}} updateTask={updateTask} />,
    )

    const lengthInput = screen.getByLabelText(/length/i)
    await user.clear(lengthInput)
    await user.type(lengthInput, '2')
    const assigneeInput = screen.getByLabelText(/assignee/i)
    await user.clear(assigneeInput)
    await user.type(assigneeInput, 'baz')

    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(updateTask).toHaveBeenCalledWith({
      id: 1,
      name: 'task1',
      projId: 1,
      startDate: new Date('2024-04-04'),
      endDate: new Date('2024-04-05'),
      assignee: 'baz',
      length: 2,
      effectiveLength: 2,
      dependenciesId: [],
      color: 'red',
    })
  })
})