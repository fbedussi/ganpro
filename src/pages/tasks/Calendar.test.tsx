import React from 'react'
import { getByText, render, screen } from '../../test-utils'
import Calendar from './Calendar'
import { Task } from '../../model'

describe('calendar', () => {
  it('shows the current day if there are no tasks', () => {
    render(<Calendar tasks={[]} />)

    expect(screen.getByTestId(new Date().toISOString().split('T')[0])).toBeInTheDocument()
  })

  it('shows the current month if there are no tasks', () => {
    render(<Calendar tasks={[]} />)

    expect(
      screen.getByTestId(new Date().toISOString().split('T')[0].substring(0, 7)),
    ).toBeInTheDocument()
  })

  it('shows the day of the earlier task', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-05-04'),
        endDate: new Date('2024-05-04'),
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
        startDate: new Date('2024-04-04'),
        endDate: new Date('2024-04-04'),
        length: 2,
        effectiveLength: 2,
        assignee: 'me',
        dependenciesId: [],
        color: 'green',
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('2024-04-04')).toBeInTheDocument()
  })

  it('shows the name of the month of the earlier task', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-05-04'),
        endDate: new Date('2024-05-04'),
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
        startDate: new Date('2024-04-04'),
        endDate: new Date('2024-04-05'),
        length: 2,
        effectiveLength: 2,
        assignee: 'me',
        dependenciesId: [],
        color: 'green',
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(getByText(screen.getByTestId('2024-04'), /aprile/i)).toBeInTheDocument()
  })

  it('shows the full month for every task', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-04'),
        endDate: new Date('2024-04-04'),
        length: 1,
        effectiveLength: 1,
        assignee: 'me',
        dependenciesId: [],
        color: 'red',
      },
      {
        id: 2,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-05-04'),
        endDate: new Date('2024-05-04'),
        length: 1,
        effectiveLength: 1,
        assignee: 'me',
        dependenciesId: [],
        color: 'red',
      },
    ]

    render(<Calendar tasks={tasks} />)

    for (let day = 1; day <= 30; day++) {
      expect(screen.getByTestId(`2024-04-${day < 10 ? `0${day}` : day}`)).toBeInTheDocument()
    }
    for (let day = 1; day <= 31; day++) {
      expect(screen.getByTestId(`2024-05-${day < 10 ? `0${day}` : day}`)).toBeInTheDocument()
    }
  })

  test('non working days are visually marked', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-24'),
        endDate: new Date('2024-04-24'),
        length: 1,
        effectiveLength: 1,
        assignee: 'me',
        dependenciesId: [],
        color: 'red',
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('2024-04-25')).toHaveClass('holiday')
    expect(screen.getByTestId('2024-04-27')).toHaveClass('weekend')
    expect(screen.getByTestId('2024-04-28')).toHaveClass('weekend')
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
        endDate: new Date('2024-04-04'),
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
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-05'),
        length: 1,
        effectiveLength: 1,
        assignee: 'me',
        dependenciesId: [],
        color: 'green',
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('task-1_bar')).toBeInTheDocument()
    expect(screen.getByTestId('task-2_bar')).toBeInTheDocument()
  })
})

describe('dependencies', () => {
  it('shows dependencies', () => {
    const tasks: Task[] = [
      {
        id: 1,
        projId: 1,
        name: 'task1',
        startDate: new Date('2024-04-04'),
        endDate: new Date('2024-04-04'),
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
        startDate: new Date('2024-04-05'),
        endDate: new Date('2024-04-05'),
        length: 1,
        effectiveLength: 1,
        assignee: 'me',
        dependenciesId: [1],
        color: 'green',
      },
    ]

    render(<Calendar tasks={tasks} />)

    expect(screen.getByTestId('dependency-1->2')).toBeInTheDocument()
  })
})
