import { Project, Task } from '../model'
import { ONE_DAY } from '../pages/tasks/helpers'

export const mockProject = (fields?: Partial<Project>): Project => {
  return {
    id: Math.round(Date.now() * Math.random()),
    name: 'mocked project',
    ...fields,
  }
}

export const mockTask = (taskFields?: Partial<Task>) => {
  const startDate = taskFields?.startDate || new Date()
  const length = taskFields?.length || 1
  const task: Task = {
    id: Math.round(Date.now() * Math.random()),
    projId: 1,
    name: 'mocked task',
    startDate,
    endDate: new Date(startDate.getTime() + ONE_DAY * length),
    length,
    effectiveLength: 1,
    assignee: '',
    dependenciesId: [],
    color: '#001100',
    completed: 0,
    ...taskFields,
  }

  return task
}
