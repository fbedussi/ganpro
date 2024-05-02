import Holidays, { HolidaysTypes } from 'date-holidays'
import { Task } from '../../model'

let hd: Holidays | undefined

export const ONE_DAY = 1000 * 60 * 60 * 24

export const getHolidaysClass = (country: string): Holidays => {
  if (!hd) {
    hd = new Holidays()
    hd.init(country)
  }
  return hd
}

export const calculateTaskLength = (task: Task, hd: Holidays) => {
  const startWeekDay = task.startDate.getDay()
  const weekends = Math.floor((startWeekDay + (task.length - 1)) / 5)

  const lengthWithHolidays = task.length + weekends * 2

  const taskStartTime = task.startDate.getTime()

  const findFirstNextHolyday = (holidays: HolidaysTypes.Holiday[], startTime: number) =>
    holidays.findIndex(({ start }) => start.getTime() > startTime)

  const holidays = hd.getHolidays()
  const firstHolydayAfterStartTimeIndex = findFirstNextHolyday(holidays, taskStartTime)
  let taskEndTime = taskStartTime + lengthWithHolidays * ONE_DAY
  let index = firstHolydayAfterStartTimeIndex
  let includedHolydays = 0
  while (holidays[index].end.getTime() < taskEndTime) {
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

export const getRandomColor = () => {
  const getRandomColorValue = () => Math.round(Math.random() * 255)

  const randomRed = getRandomColorValue()
  const randomGreen = getRandomColorValue()
  const randomBlue = getRandomColorValue()
  const randomColor = `rgb(${randomRed}, ${randomGreen}, ${randomBlue})`
  return randomColor
}
