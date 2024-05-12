import React, { ForwardedRef, forwardRef } from 'react'
import { Day, Task } from '../../model'
import styled from 'styled-components'
import { calculateTaskBarStyle } from './helpers'

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
    days,
  }: {
    ref: ForwardedRef<HTMLDivElement>
    task: Task
    taskIndex: number
    days: Day[]
  },
  ref: ForwardedRef<HTMLDivElement>,
) => {
  return (
    <Wrapper
      ref={ref}
      data-testid={`task-${task.id}_bar`}
      style={calculateTaskBarStyle(task, taskIndex, days)}
    ></Wrapper>
  )
}

export default forwardRef(TaskBar)
