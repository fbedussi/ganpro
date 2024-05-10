import React, { useEffect, useRef } from 'react'
import { Task } from '../../model'
import {
  calculateDependencyStyle,
  formatMonthNameForCalHeader,
  getDependencies,
  getHolidaysClass,
  getMonthDays,
  getTasksMonths,
} from './helpers'
import styled, { css } from 'styled-components'
import TaskBar from './TaskBar'

const Container = styled.div`
  --col-width: 3rem;
  --row-height: 2rem;
  --row-gap: 1rem;
  --cell-padding: 0.5rem 1rem;
  --border-color: lightgray;
  --color: darkslategray;
  --connector-color: black;
  --connector-width: 2px;
  --header-gap: 1rem;

  display: flex;
  height: 100%;
  font-size: 0.75rem;
`

const TaskList = styled.div`
  width: 8rem;
  flex-shrink: 0;
  margin-top: calc(var(--row-height) * 2);
  padding-top: var(--header-gap);
  border-top: solid 1px var(--border-color);
  display: grid;
  grid-template-rows: repeat(auto-fill, var(--row-height));
  row-gap: var(--row-gap);

  > * {
    padding: var(--cell-padding);
    color: var(--color);
  }
`

const ScrollContainer = styled.div`
  overflow: auto;
`

const Graph = styled.div`
  position: relative;
  height: 100%;
  flex: 1;
  width: fit-content;
`

const Months = styled.div`
  display: flex;
  height: 100%;
  width: min-content;
`

const Month = styled.div`
  border-top: solid 1px var(--border-color);
  border-bottom: solid 1px var(--border-color);
  border-left: solid 1px var(--border-color);
  display: flex;
  flex-direction: column;
  width: min-content;
  height: 100%;

  &:last-child {
    border-right: solid 1px var(--border-color);
  }

  .weekend {
    background-color: whitesmoke;
  }

  .holiday {
    background-color: gainsboro;
  }
`

const MonthName = styled.div`
  text-align: center;
  padding: var(--cell-padding);
  text-transform: uppercase;
  color: var(--color);
  border-bottom: solid 1px var(--border-color);
  height: var(--row-height);
`

const Days = styled.div`
  flex: 1;
  display: flex;
`

const Day = styled.div`
  width: var(--col-width);
  padding: var(--cell-padding);
  text-align: center;
  color: var(--color);

  &:not(:first-child) {
    border-left: solid 1px var(--border-color);
  }
`

const overlayLayers = css`
  position: absolute;
  left: 0;
  width: 100%;
  top: calc(var(--row-height) * 2);
  padding-top: var(--header-gap);
  height: calc(100% - (var(--row-height) * 2));
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--col-width));
  grid-template-rows: repeat(auto-fill, var(--row-height));
  border: solid 1px var(--border-color);
  row-gap: var(--row-gap);
`

const Tasks = styled.div`
  ${overlayLayers}
`

const Dependencies = styled.div`
  ${overlayLayers}
`

const Dependency = styled.div`
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: calc(var(--row-height) / 2);
    left: calc(-0.5rem + var(--connector-width));
    width: calc(50% + 0.5rem);
    height: calc((100% - var(--row-height)) / 2);
    border-top: solid var(--connector-width) var(--connector-color);
    border-right: solid var(--connector-width) var(--connector-color);
    border-radius: 0 5px 0 0;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: calc(var(--row-height) / 2);
    left: 50%;
    height: calc((100% - var(--row-height)) / 2);
    width: calc(50% + 0.5rem);
    border-left: solid var(--connector-width) var(--connector-color);
    border-bottom: solid var(--connector-width) var(--connector-color);
    border-radius: 0 0 0 5px;
  }
`

const hd = getHolidaysClass('IT')

export const Calendar = ({ tasks }: { tasks: Task[] }) => {
  const startDateFull = tasks.length
    ? tasks.slice().sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0].startDate
    : new Date()

  const holidays = hd.getHolidays(startDateFull.getFullYear())

  const months = getTasksMonths(tasks).map(month => ({
    month,
    days: getMonthDays(month).map(day => {
      const task = tasks.find(task => task.startDate.toISOString().includes(day))

      const date = new Date(day)
      const dayOfWeek = date.getDay()
      return {
        date: day,
        month,
        isWeekend: [0, 6].includes(dayOfWeek),
        isHoliday: holidays.some(holiday => holiday.date.includes(day)),
        task,
      }
    }),
  }))

  const dates = months.flatMap(({ days }) => days.map(({ date }) => date))

  const scrollElRef = useRef<HTMLDivElement>(null)
  const firstTaskRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollElRef.current && firstTaskRef.current) {
      const scrollRight = firstTaskRef.current.offsetLeft
      scrollElRef.current.scrollLeft = scrollRight
    }
  }, [])

  const dependencies = getDependencies(tasks)

  return (
    <Container data-testid="calendar">
      <TaskList>
        {tasks.map(task => (
          <div key={task.id}>{task.name}</div>
        ))}
      </TaskList>

      <ScrollContainer ref={scrollElRef}>
        <Graph>
          <Months>
            {months.map(({ month, days }) => (
              <Month key={month} data-testid={month}>
                <MonthName>{formatMonthNameForCalHeader(month)}</MonthName>
                <Days>
                  {days.map(({ date, isWeekend, isHoliday }) => (
                    <Day
                      key={date}
                      data-testid={date}
                      className={[isWeekend ? 'weekend' : '', isHoliday ? 'holiday' : ''].join(' ')}
                    >
                      {date.substring(8)}
                    </Day>
                  ))}
                </Days>
              </Month>
            ))}
          </Months>

          <Tasks>
            {tasks.map((task, index) => (
              <TaskBar
                ref={index === 0 ? firstTaskRef : null}
                key={task.id}
                task={task}
                taskIndex={index}
                firstDay={Number(months[0].days[0].date.substring(8))}
              />
            ))}
          </Tasks>

          <Dependencies>
            {dependencies.map(dependency => {
              const key = `dependency-${dependency.from.id}->${dependency.to.id}`
              return (
                <Dependency
                  key={key}
                  data-testid={key}
                  style={calculateDependencyStyle(dependency, dates)}
                ></Dependency>
              )
            })}
          </Dependencies>
        </Graph>
      </ScrollContainer>
    </Container>
  )
}

export default Calendar
