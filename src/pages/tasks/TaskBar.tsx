import React, { ForwardedRef, forwardRef } from 'react'
import { Task } from '../../model'
import styled from 'styled-components'
import { calculateTaskLength } from './helpers'
import { HolidaysTypes } from 'date-holidays'

const Wrapper = styled.div`
  height: var(--row-height);
  border-radius: 4px;
  position: relative;
  border: solid 2px transparent;
`

const TaskBar = (
  {
    task,
    taskIndex,
    hd,
    firstDay,
  }: {
    ref: ForwardedRef<HTMLDivElement>
    task: Task
    taskIndex: number
    firstDay: number
    hd: HolidaysTypes.Holiday[]
  },
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const taskLength = calculateTaskLength(task, hd)
  return (
    <Wrapper
      ref={ref}
      data-testid={`task-${task.id}_bar`}
      style={{
        backgroundColor: task.color,
        gridRowStart: taskIndex + 1,
        gridColumnStart: task.startDate.getDate() - firstDay + 1,
        gridColumnEnd: `span ${taskLength}`,
      }}
    ></Wrapper>
  )
}

export default forwardRef(TaskBar)
