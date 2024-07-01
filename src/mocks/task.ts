import { Task } from '../model'
import { ONE_DAY } from '../pages/tasks/helpers'

export const mockTask = (taskFields: Partial<Task>) => {
  const task: Task = {
    id: 1,
    projId: 1,
    name: 'mocked task',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + ONE_DAY),
    length: 1,
    effectiveLength: 1,
    assignee: '',
    dependenciesId: [],
    color: '#001100',
    ...taskFields,
  }

  return task
}
