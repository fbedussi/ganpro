import userEvent from '@testing-library/user-event'
import { Task } from '../../model/task'
import { render, screen } from '../../test-utils'
import NewTaskData from './NewTaskData'
import React from 'react'

describe('NewTaskData', () => {
  it('shows the task fields', () => {
    render(<NewTaskData taskName="task1" projId={1} projectTasks={[]} saveTask={() => {}} />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/length/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/assignee/i)).toBeInTheDocument()
    expect(screen.getByRole('listbox', { name: /dependencies/i })).toBeInTheDocument()
  })

  it('the dependencies do not have a selected value', () => {
    render(
      <NewTaskData
        taskName="task2"
        projId={1}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={() => {}}
      />,
    )
    const dependencies = screen.getByRole('listbox', {
      name: /dependencies/i,
    }) as HTMLSelectElement
    expect(dependencies.value).toBe('')
  })

  it('multiple dependencies can be selected', () => {
    render(
      <NewTaskData
        taskName="task2"
        projId={1}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={() => {}}
      />,
    )
    const dependencies = screen.getByRole('listbox', {
      name: /dependencies/i,
    }) as HTMLSelectElement
    expect(dependencies.multiple).toBe(true)
  })

  it('has required fields', () => {
    render(<NewTaskData taskName="task1" projId={1} projectTasks={[]} saveTask={() => {}} />)
    expect((screen.getByLabelText(/name/i) as HTMLInputElement).required).toBe(true)
    expect((screen.getByLabelText(/start date/i) as HTMLInputElement).required).toBe(true)
    expect((screen.getByLabelText(/length/i) as HTMLInputElement).required).toBe(true)
  })

  it('saves the task', async () => {
    const user = userEvent.setup()

    const saveTask = jest.fn()
    render(
      <NewTaskData
        taskName="task1"
        projId={1}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={saveTask}
      />,
    )
    await user.type(screen.getByLabelText(/start date/i), '2024-04-03')
    await user.type(screen.getByLabelText(/length/i), '2')
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
      <NewTaskData
        taskName="task1"
        projId={1}
        projectTasks={[
          {
            name: 'task1',
            id: 1,
            projId: 1,
          } as Task,
        ]}
        saveTask={saveTask}
      />,
    )
    await user.type(screen.getByLabelText(/start date/i), '2024-04-24')
    await user.type(screen.getByLabelText(/length/i), '4')
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
})
