import React from 'react'
import { Task } from '../../model/task'

const TaskCard = ({ task }: { task: Task }) => {
  return <article>{task.name}</article>
}

export default TaskCard
