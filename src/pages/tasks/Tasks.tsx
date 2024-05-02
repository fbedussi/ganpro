import { useParams } from 'react-router-dom'
import { Task } from '../../model/task'
import { Project } from '../../model/project'
import TaskCard from './TaskCard'
import { ChangeEvent, useState } from 'react'
import Modal from '../../styleguide/Modal'
import NewTaskData from './NewTaskData'
import { useGetProjectQuery } from '../../services/projects'
import { Progress } from '../../styleguide/Progress'
import { useAddTaskMutation, useGetTasksByProjectQuery } from '../../services/tasks'
import Calendar from './Calendar'
import Header from '../../components/Header'
import styled from 'styled-components'
import React from 'react'

const Main = styled.main`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
  flex: 1;
`

export const _Tasks = ({
  project,
  tasks,
  saveNewTask,
}: {
  project: Project
  tasks: Task[]
  saveNewTask: (task: Omit<Task, 'id'>) => void
}) => {
  const [disableAddTaskBtn, setDisableAddTaskBtn] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')

  return (
    <>
      <Header title={`${project.name} tasks`} />

      <Main className="container">
        <div>
          {tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          <label>
            New task
            <input
              type="text"
              data-testid="new-task-input"
              value={newTaskName}
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setDisableAddTaskBtn(!ev.target.value.length)
                setNewTaskName(ev.target.value)
              }}
            />
          </label>
          <button
            data-testid="add-task-btn"
            disabled={disableAddTaskBtn}
            onClick={() => {
              setIsModalOpen(true)
            }}
          >
            Add task
          </button>
        </div>

        <Calendar tasks={tasks} />
      </Main>

      <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <NewTaskData
          projId={project.id}
          taskName={newTaskName}
          projectTasks={tasks}
          saveTask={newTask => {
            setNewTaskName('')
            setDisableAddTaskBtn(true)
            setIsModalOpen(false)
            saveNewTask(newTask)
          }}
        />
      </Modal>
    </>
  )
}

const Tasks = () => {
  const { projId } = useParams<{ projId: string }>()
  const { data: project } = useGetProjectQuery(Number(projId))
  const { data: tasks } = useGetTasksByProjectQuery(Number(projId))
  const [saveNewTask] = useAddTaskMutation()

  return !project ? (
    <Progress />
  ) : (
    <_Tasks project={project} tasks={tasks || []} saveNewTask={saveNewTask} />
  )
}

export default Tasks
