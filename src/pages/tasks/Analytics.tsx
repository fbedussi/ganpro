import { getLocalizedDateShort } from '../../helpers/time'
import { Project, Task } from '../../model'
import { getPercentageDone, getTasksStartAndEndDates } from './helpers'

export const Analytics = ({ project, tasks }: { project: Project; tasks: Task[] }) => {
  const [startDate, endDate] = getTasksStartAndEndDates(tasks)

  const percentageDone = getPercentageDone(tasks)

  return (
    <div data-testid="analytics">
      <table>
        <thead>
          <tr>
            <th colSpan={2}>{project.name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Number of tasks</td>
            <td data-testid="number-of-tasks">{tasks.length}</td>
          </tr>
          <tr>
            <td>Start date</td>
            <td data-testid="start-date">{startDate && getLocalizedDateShort(startDate)}</td>
          </tr>
          <tr>
            <td>Due date</td>
            <td data-testid="due-date">{endDate && getLocalizedDateShort(endDate)}</td>
          </tr>
          <tr>
            <td>Percentage of done</td>
            <td data-testid="percentage-done">{percentageDone}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
