import React from 'react'
import { Task } from '../../model'
import { ONE_DAY, calculateTaskLength, getHolidaysClass } from './helpers'

const hd = getHolidaysClass('IT')

export const _calculateTaskLength = (task: Task) => {
  return task.length
}

export const Calendar = ({ tasks }: { tasks: Task[] }) => {
  const startDateFull = tasks.length
    ? tasks.slice().sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].startDate
    : new Date()

  const holidays = hd.getHolidays(startDateFull.getFullYear())

  const dates = new Array(11).fill(undefined).map((_, index) => {
    const date = new Date(startDateFull.getTime() + ONE_DAY * index)
    const day = date.getDay()

    const shortDate = date.toISOString().split('T')[0]

    const task = tasks.find(task => task.startDate.toISOString().includes(shortDate))

    return {
      date: shortDate,
      isWeekend: [0, 6].includes(day),
      isHoliday: holidays.some(holiday => holiday.date.includes(shortDate)),
      task,
    }
  })

  return (
    <div data-testid="calendar">
      {dates.map(({ date, isWeekend, isHoliday, task }) => (
        <div
          key={date}
          data-testid={date}
          className={[isWeekend ? 'weekend' : '', isHoliday ? 'holiday' : ''].join(' ')}
        >
          {date}
          {!!task && (
            <div
              data-testid={`task-${task.id}_bar`}
              className={`length-${calculateTaskLength(task, hd)}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Calendar
