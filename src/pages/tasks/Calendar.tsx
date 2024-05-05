import React from 'react'
import { Task } from '../../model'
import { ONE_DAY, formatMonthNameForCalHeader, getHolidaysClass } from './helpers'
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
      month: shortDate.substring(0, 7),
      isWeekend: [0, 6].includes(day),
      isHoliday: holidays.some(holiday => holiday.date.includes(shortDate)),
      task,
    }
  })

  const months = [...new Set(dates.map(({ month }) => month))]

  return (
    <Container data-testid="calendar">
      <TaskList>
        {tasks.map(task => (
          <div key={task.id}>{task.name}</div>
        ))}
      </TaskList>

      <ScrollContainer>
        <Graph>
          <Months>
            {months.map(month => (
              <Month key={month} data-testid={month}>
                <MonthName>{formatMonthNameForCalHeader(month)}</MonthName>
                <Days>
                  {dates
                    .filter(date => date.month === month)
                    .map(({ date, isWeekend, isHoliday }) => (
                      <Day
                        key={date}
                        data-testid={date}
                        className={[isWeekend ? 'weekend' : '', isHoliday ? 'holiday' : ''].join(
                          ' ',
                        )}
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
                key={task.id}
                task={task}
                taskIndex={index}
                hd={hd}
                firstDay={Number(dates[0].date.substring(8))}
              />
            ))}
          </Tasks>
        </Graph>
      </ScrollContainer>
    </Container>
  )
}

export default Calendar
