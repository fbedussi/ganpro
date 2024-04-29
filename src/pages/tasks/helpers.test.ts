import Holidays from 'date-holidays'
import { Task } from '../../model'
import { calculateTaskLength } from './helpers'

const hd = new Holidays()
hd.init('IT')

describe('calculateTaskLength', () => {
  it('returns task length if the task do not span over holidays or weekends', () => {
    const task = {
      startDate: new Date('2024-04-15'),
      length: 3,
    } as Task
    expect(calculateTaskLength(task, hd)).toBe(task.length)
  })

  it('returns task length + weekends if the task span over weekends', () => {
    const task = {
      startDate: new Date('2024-04-26'),
      length: 2,
    } as Task
    expect(calculateTaskLength(task, hd)).toBe(4)
  })

  it('returns task length + holidays if the task span over holydays', () => {
    const task = {
      startDate: new Date('2024-04-24'),
      length: 2,
    } as Task
    expect(calculateTaskLength(task, hd)).toBe(3)
  })

  it('returns task length + holidays if the task span over multiple holydays', () => {
    const task = {
      startDate: new Date('2024-04-24'),
      length: 5,
    } as Task
    expect(calculateTaskLength(task, hd)).toBe(9)
  })
})
