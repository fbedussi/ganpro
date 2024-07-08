import { getLocalizedDateShort } from '../../helpers/time'
import { mockProject, mockTask } from '../../mocks/task'
import { render, screen } from '../../test-utils'
import { Analytics } from './Analytics'

describe('analytics', () => {
  const project = mockProject()

  const tasks = [
    mockTask({
      projId: project.id,
      startDate: new Date('2020-04-08'),
      completed: 100,
    }),
    mockTask({
      projId: project.id,
      startDate: new Date('2020-04-09'),
    }),
    mockTask({
      projId: project.id,
      startDate: new Date('2020-04-10'),
    }),
  ]

  it('reports the number of tasks', () => {
    render(<Analytics project={project} tasks={tasks} />)

    expect(screen.getByTestId('number-of-tasks').textContent).toBe(tasks.length.toString())
  })

  it('reports the start date', () => {
    render(<Analytics project={project} tasks={tasks} />)

    expect(screen.getByTestId('start-date').textContent).toBe(
      getLocalizedDateShort(new Date('2020-04-08')),
    )
  })

  it('reports the due date', () => {
    render(<Analytics project={project} tasks={tasks} />)

    expect(screen.getByTestId('due-date').textContent).toBe(
      getLocalizedDateShort(new Date('2020-04-11')),
    )
  })

  it('reports the percentage of done', () => {
    render(<Analytics project={project} tasks={tasks} />)

    expect(screen.getByTestId('percentage-done').textContent).toBe('33%')
  })
})
