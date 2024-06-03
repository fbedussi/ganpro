import { Day, Id } from './types'

export type Task = {
  id: Id
  projId: number
  name: string
  startDate: Date
  endDate: Date
  length: number
  effectiveLength: number
  assignee: string
  dependenciesId: number[]
  color: string
}

export type Dependency = {
  from: {
    id: Id
    index: number
    endDate: Day
  }
  to: {
    id: Id
    index: number
    startDate: Day
  }
}
