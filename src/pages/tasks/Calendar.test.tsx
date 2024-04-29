import React from 'react'
import { render, screen } from '../../test-utils'
import Calendar from './Calendar'
import { Task } from '../../model'

describe('calendar', () => {
  it('shows the current day if there are no tasks', () => {
    render(<Calendar tasks={[]} />)

    expect(screen.getByTestId(new Date().toISOString().split('T')[0])).toBeInTheDocument()
  })

  it('shows the day of the earlier task', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-05-04'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
      {
        id: 2,
        projId: 1,
        name: 'task2',
        startDate: new Date('2024-04-04'),
        length: 2,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('2024-04-04')).toBeInTheDocument()
  })

  it('shows the next 10 days, after the starting one', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-04'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    for (let day = 4; day <= 14; day++) {
      expect(screen.getByTestId(`2024-04-${day < 10 ? `0${day}` : day}`)).toBeInTheDocument()
    }
  })

  test('non working days are visually marked', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-24'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('2024-04-25')).toHaveClass('holiday')
    expect(screen.getByTestId('2024-04-27')).toHaveClass('weekend')
    expect(screen.getByTestId('2024-04-28')).toHaveClass('weekend')
    expect(screen.getByTestId('2024-05-01')).toHaveClass('holiday')
  })
})

describe('taskbars', () => {
  test('there is a taskbar for every task', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-04'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
      {
        id: 2,
        projId: 1,
        name: 'task2',
        startDate: new Date('2024-04-05'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('task-1_bar')).toBeInTheDocument()
    expect(screen.getByTestId('task-2_bar')).toBeInTheDocument()
  })

  test('task bars length is the same as the task length if it does not include non working days', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-01'),
        length: 1,
        assignee: 'me',
        dependenciesId: [],
      },
      {
        id: 2,
        projId: 1,
        name: 'task2',
        startDate: new Date('2024-04-02'),
        length: 2,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('task-1_bar')).toHaveClass('length-1')
    expect(screen.getByTestId('task-2_bar')).toHaveClass('length-2')
  })

  test('task bars length is the same as the task length + non working days', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-24'),
        length: 3,
        assignee: 'me',
        dependenciesId: [],
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('task-1_bar')).toHaveClass('length-6')
  })
})
