import { ChangeEvent, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Task } from '../../model/task'
import { Project } from '../../model/project'
import Modal from '../../styleguide/Modal'
import TaskData from './TaskData'
import { useGetProjectQuery } from '../../services/projects'
import { Progress } from '../../styleguide/Progress'
import {
  useAddTaskMutation,
  useGetTasksByProjectQuery,
  useUpdateTaskMutation,
} from '../../services/tasks'
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
  updateTask,
}: {
  project: Project
  tasks: Task[]
  saveNewTask: (task: Omit<Task, 'id'>) => void
  updateTask: (task: Task) => void
}) => {
  const [disableAddTaskBtn, setDisableAddTaskBtn] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTaskName, setNewTaskName] = useState('')

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

  useEffect(() => {
    setIsModalOpen(!!selectedTask)
  }, [selectedTask])

  return (
    <>
      <Header
        pre={
          <Link to="/" data-testid="back-button">
            Back
          </Link>
        }
        title={`${project.name} tasks`}
      />

      <Main className="container">
        <Calendar tasks={tasks} setSelectedTask={setSelectedTask} />

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
            className="button"
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

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false)

          if (selectedTask) {
            setSelectedTask(undefined)
          }
        }}
      >
        <TaskData
          data={selectedTask || { projId: project.id, name: newTaskName }}
          projectTasks={tasks}
          saveTask={newTask => {
            setNewTaskName('')
            setDisableAddTaskBtn(true)
            setIsModalOpen(false)
            saveNewTask(newTask)
          }}
          updateTask={task => {
            updateTask(task)
            setSelectedTask(undefined)
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
  const [updateTask] = useUpdateTaskMutation()

  return !project ? (
    <Progress />
  ) : (
    <_Tasks
      project={project}
      tasks={tasks?.slice() || []}
      saveNewTask={saveNewTask}
      updateTask={updateTask}
    />
  )
}

export default Tasks
