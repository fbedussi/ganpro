import Holidays, { HolidaysTypes } from 'date-holidays'
import { Day, Dependency, Month, Task } from '../../model'
import { padNumber } from '../../helpers/utils'

let hd: Holidays | undefined

export const ONE_DAY = 1000 * 60 * 60 * 24

export const getHolidaysClass = (country: string): Holidays => {
  if (!hd) {
    hd = new Holidays()
    hd.init(country)
  }
  return hd
}

export const calculateTaskLength = (
  task: Pick<Task, 'startDate' | 'length'>,
  holidays: HolidaysTypes.Holiday[],
) => {
  const startWeekDay = task.startDate.getDay()
  const weekends = Math.floor((startWeekDay + (task.length - 1)) / 5)

  const lengthWithHolidays = task.length + weekends * 2

  const taskStartTime = task.startDate.getTime()

  const findFirstNextHolyday = (holidays: HolidaysTypes.Holiday[], startTime: number) =>
    holidays.findIndex(({ start }) => start.getTime() > startTime)

  const firstHolydayAfterStartTimeIndex = findFirstNextHolyday(holidays, taskStartTime)
  let taskEndTime = taskStartTime + lengthWithHolidays * ONE_DAY
  let index = firstHolydayAfterStartTimeIndex
  let includedHolydays = 0
  while (holidays[index]?.end.getTime() < taskEndTime) {
    includedHolydays++
    taskEndTime += ONE_DAY
    const nextIndex = index + 1
    index = findFirstNextHolyday(holidays.slice(nextIndex), taskStartTime) + nextIndex
  }

  return lengthWithHolidays + includedHolydays
}

export const formatDateForCalHeader = (dateStr: string, locale = 'it-IT') => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date)
}

export const formatMonthNameForCalHeader = (dateStr: string, locale = 'it-IT') => {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat(locale, { month: 'long' }).format(date)
}

export const getRandomColor = () => {
  const getRandomColorValue = () => Math.round(Math.random() * 255)

  const randomRed = getRandomColorValue()
  const randomGreen = getRandomColorValue()
  const randomBlue = getRandomColorValue()
  const randomColor = `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`
  return randomColor
}

export const getTasksStartAndEndDates = (tasks: Task[], hd: HolidaysTypes.Holiday[]) => {
  const startDate = tasks.length
    ? tasks.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].startDate
    : undefined

  const endTimestamp = tasks.length
    ? tasks
        .map(task =>
          new Date(
            task.startDate.getTime() + ONE_DAY * (calculateTaskLength(task, hd) - 1),
          ).getTime(),
        )
        .sort((a, b) => b - a)[0]
    : undefined

  return [startDate, endTimestamp !== undefined ? new Date(endTimestamp) : undefined]
}

export const getMonthStart = (input: Date | string) => {
  const date = new Date(input)
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthStart = `${year}-${padNumber(month + 1)}-01`
  return monthStart as Day
}

export const getMonthEnd = (input: Date | string) => {
  const date = new Date(input)
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthEnd = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0]
  return monthEnd as Day
}

export const getMonthDays = (month: Month) => {
  const startDay = getMonthStart(month)
  const endDay = getMonthEnd(month)

  const days = [startDay]
  let i = 0
  while (days[i] !== endDay) {
    const currentDay = days[i]
    if (!currentDay) {
      throw new Error('unexpected error')
    }

    const [year, month, day] = currentDay.split('-')
    const nextDay = Number(day) + 1

    days.push(`${year}-${month}-${padNumber(nextDay)}`)
    i++
  }
  return days
}

export const getTasksMonths = (tasks: Task[], hd: HolidaysTypes.Holiday[]) => {
  const [startDay, endDay] = getTasksStartAndEndDates(tasks, hd)

  const startMonth = (startDay || new Date()).toISOString().substring(0, 7) as Month
  const endMonth = (endDay || new Date()).toISOString().substring(0, 7) as Month

  const months: Month[] = [startMonth]
  let i = 0
  while (months[i] !== endMonth) {
    const currentMonth = months[i]
    if (!currentMonth) {
      throw new Error('unexpected error')
    }
    const [year, month] = currentMonth.split('-')
    const nextMonth = month === '12' ? 1 : Number(month) + 1
    const nextYear = month === '12' ? Number(year) + 1 : Number(year)
    months.push(`${nextYear}-${padNumber(nextMonth)}`)
    i++
  }

  return months
}

export const getDependencies = (tasks: Task[]): Dependency[] => {
  const dependencies = tasks.flatMap((task, index) =>
    task.dependenciesId.map(dependencyId => {
      const fromIndex = tasks.findIndex(task => task.id === dependencyId)
      const dependency: Dependency = {
        from: {
          id: dependencyId,
          index: fromIndex,
          endDate: tasks[fromIndex].endDate.toISOString().split('T')[0] as Day,
        },
        to: {
          id: task.id,
          index,
          startDate: task.startDate.toISOString().split('T')[0] as Day,
        },
      }
      return dependency
    }),
  )

  return dependencies
}

export const calculateDependencyStyle = (dependency: Dependency, days: Day[]) => {
  const gridColumnStart = days.indexOf(dependency.from.endDate) + 2
  const gridColumnEnd = days.indexOf(dependency.to.startDate) + 1

  return {
    gridRowStart: dependency.from.index + 1,
    gridRowEnd: dependency.to.index + 2,
    gridColumnStart,
    gridColumnEnd,
    width: gridColumnStart === gridColumnEnd ? 0 : undefined,
  }
}
