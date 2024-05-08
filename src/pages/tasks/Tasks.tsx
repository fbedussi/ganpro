import React, { ChangeEvent, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Task } from '../../model/task'
import { Project } from '../../model/project'
import Modal from '../../styleguide/Modal'
import NewTaskData from './NewTaskData'
import { useGetProjectQuery } from '../../services/projects'
import { Progress } from '../../styleguide/Progress'
import { useAddTaskMutation, useGetTasksByProjectQuery } from '../../services/tasks'
import Calendar from './Calendar'
import Header from '../../components/Header'
import styled from 'styled-components'

const Main = styled.main`
  display: flex;
  flex-direction: column;
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
        <Calendar tasks={tasks} />

        <div>
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
    <_Tasks project={project} tasks={tasks?.slice() || []} saveNewTask={saveNewTask} />
  )
}

export default Tasks
