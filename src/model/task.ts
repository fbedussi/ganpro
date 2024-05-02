import { Id } from './types'

export type Task = {
  id: Id
  projId: number
  name: string
  startDate: Date
  length: number
  assignee: string
  dependenciesId: number[]
  color: string
}
