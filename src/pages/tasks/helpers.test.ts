import Holidays from 'date-holidays'
import { Task } from '../../model'
import {
  calculateTaskLength,
  formatDateForCalHeader,
  formatMonthNameForCalHeader,
  getMonthDays,
  getMonthEnd,
  // getMonthRange,
  getMonthStart,
  getRandomColor,
  getTasksMonths,
  getTasksStartAndEndDates,
} from './helpers'

const hd = new Holidays()
hd.init('IT')
const holidays = hd.getHolidays(new Date().getFullYear())

describe('calculateTaskLength', () => {
  it('returns task length if the task do not span over holidays or weekends', () => {
    const task = {
      startDate: new Date('2024-04-15'),
      length: 3,
    } as Task
    expect(calculateTaskLength(task, holidays)).toBe(task.length)
  })

  it('returns task length + weekends if the task span over weekends', () => {
    const task = {
      startDate: new Date('2024-04-26'),
      length: 2,
    } as Task
    expect(calculateTaskLength(task, holidays)).toBe(4)
  })

  it('returns task length + holidays if the task span over holydays', () => {
    const task = {
      startDate: new Date('2024-04-24'),
      length: 2,
    } as Task
    expect(calculateTaskLength(task, holidays)).toBe(3)
  })

  it('returns task length + holidays if the task span over multiple holydays', () => {
    const task = {
      startDate: new Date('2024-04-24'),
      length: 5,
    } as Task
    expect(calculateTaskLength(task, holidays)).toBe(9)
  })
})

describe('formatDateForCalHeader', () => {
  it('returns month and day', () => {
    expect(formatDateForCalHeader('2024-04-10')).toBe('10 apr')
  })
})

describe('formatMonthNameForCalHeader', () => {
  it('returns the month name', () => {
    expect(formatMonthNameForCalHeader('2024-04')).toBe('aprile')
  })
})

describe('getRandomColorValue', () => {
  it('returns a random rgb color', () => {
    expect(!!getRandomColor().match(/rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/)).toBe(true)
  })
})

describe('getTasksStartAndEndDates', () => {
  it('returns [undefined, undefined] if there are no tasks', () => {
    expect(getTasksStartAndEndDates([], holidays)).toEqual([undefined, undefined])
  })

  describe('returns the start and end date of a task', () => {
    it('returns the same day if length is 1', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-04'), length: 1 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-04'), new Date('2024-04-04')])
    })

    it('returns the right end date if length is more than 1', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-01'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-01'), new Date('2024-04-03')])
    })

    it('returns the right end date considering weekends', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-04'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-04'), new Date('2024-04-08')])
    })

    it('returns the right end date considering weekends and holydays', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-24'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-24'), new Date('2024-04-29')])
    })
  })

  describe('returns the start and end date of a series of tasks', () => {
    it('returns the same day if length is 1', () => {
      expect(
        getTasksStartAndEndDates(
          [
            { startDate: new Date('2024-04-04'), length: 1 } as Task,
            { startDate: new Date('2024-05-06'), length: 1 } as Task,
          ],
          holidays,
        ),
      ).toEqual([new Date('2024-04-04'), new Date('2024-05-06')])
    })

    it('returns the right end date if length is more than 1', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-01'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-01'), new Date('2024-04-03')])
    })

    it('returns the right end date considering weekends', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-04'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-04'), new Date('2024-04-08')])
    })

    it('returns the right end date considering weekends and holydays', () => {
      expect(
        getTasksStartAndEndDates(
          [{ startDate: new Date('2024-04-24'), length: 3 } as Task],
          holidays,
        ),
      ).toEqual([new Date('2024-04-24'), new Date('2024-04-29')])
    })

    it('returns the right end date even if the first task ends after the second', () => {
      expect(
        getTasksStartAndEndDates(
          [
            { startDate: new Date('2024-04-22'), length: 10 } as Task,
            { startDate: new Date('2024-04-24'), length: 3 } as Task,
          ],
          holidays,
        ),
      ).toEqual([new Date('2024-04-22'), new Date('2024-05-07')])
    })
  })
})

describe('getMonthStart', () => {
  it('returns the start of the month', () => {
    expect(getMonthStart(new Date('2024-04-04'))).toEqual('2024-04-01')
  })

  it('accepts also strings', () => {
    expect(getMonthStart('2024-04-04')).toEqual('2024-04-01')
  })
})

describe('getMonthEnd', () => {
  it('returns the end of the month', () => {
    expect(getMonthEnd(new Date('2024-01-01'))).toEqual('2024-01-31')
  })

  it('returns the end of the month', () => {
    expect(getMonthEnd(new Date('2024-02-01'))).toEqual('2024-02-29')
  })

  it('returns the end of the month', () => {
    expect(getMonthEnd(new Date('2025-02-01'))).toEqual('2025-02-28')
  })

  it('returns the end of the month', () => {
    expect(getMonthEnd(new Date('2024-04-01'))).toEqual('2024-04-30')
  })

  it('accepts also strings', () => {
    expect(getMonthEnd('2024-04-01')).toEqual('2024-04-30')
  })
})

// describe('getMonthRange', () => {
//   it('returns the start and and month', () => {
//     expect(getMonthRange([new Date('2024-03-01'), new Date('2024-05-01')])).toEqual([
//       '2024-03',
//       '2024-05',
//     ])
//   })

//   it('accepts also strings', () => {
//     expect(getMonthRange(['2024-03-01', '2024-05-01'])).toEqual(['2024-03', '2024-05'])
//   })
// })

describe('getMonthDays', () => {
  it('returns the days in the month', () => {
    expect(getMonthDays('2024-01-01')).toEqual([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
      '2024-01-06',
      '2024-01-07',
      '2024-01-08',
      '2024-01-09',
      '2024-01-10',
      '2024-01-11',
      '2024-01-12',
      '2024-01-13',
      '2024-01-14',
      '2024-01-15',
      '2024-01-16',
      '2024-01-17',
      '2024-01-18',
      '2024-01-19',
      '2024-01-20',
      '2024-01-21',
      '2024-01-22',
      '2024-01-23',
      '2024-01-24',
      '2024-01-25',
      '2024-01-26',
      '2024-01-27',
      '2024-01-28',
      '2024-01-29',
      '2024-01-30',
      '2024-01-31',
    ])
  })
})

describe('getTasksMonths', () => {
  it('returns the month of a task', () => {
    expect(
      getTasksMonths([{ startDate: new Date('2024-04-04'), length: 1 } as Task], holidays),
    ).toEqual(['2024-04'])
  })

  it('returns the months of multiple tasks', () => {
    expect(
      getTasksMonths(
        [
          { startDate: new Date('2024-04-04'), length: 1 } as Task,
          { startDate: new Date('2024-05-04'), length: 1 } as Task,
        ],
        holidays,
      ),
    ).toEqual(['2024-04', '2024-05'])
  })

  it('considers also the end date of a task', () => {
    expect(
      getTasksMonths(
        [
          { startDate: new Date('2024-11-04'), length: 1 } as Task,
          { startDate: new Date('2025-05-15'), length: 16 } as Task,
        ],
        holidays,
      ),
    ).toEqual([
      '2024-11',
      '2024-12',
      '2025-01',
      '2025-02',
      '2025-03',
      '2025-04',
      '2025-05',
      '2025-06',
    ])
  })
})
