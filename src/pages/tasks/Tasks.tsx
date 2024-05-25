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
import { ChevronLeft } from '../../styleguide/icons/ChevronLeft'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
`

const NewTaskForm = styled.form`
  display: block;
`

const InputAndButton = styled.div`
  display: flex;
  gap: 1rem;

  input {
    flex: 1;
  }

  button {
    width: fit-content;
  }
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
            <ChevronLeft />
          </Link>
        }
        title={`${project.name} tasks`}
      />

      <Main className="container">
        <Calendar tasks={tasks} setSelectedTask={setSelectedTask} />

        <NewTaskForm
          onSubmit={e => {
            e.preventDefault()
            setIsModalOpen(true)
          }}
        >
          <label htmlFor="new-task-input">New task</label>
          <InputAndButton>
            <input
              id="new-task-input"
              type="text"
              data-testid="new-task-input"
              value={newTaskName}
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setDisableAddTaskBtn(!ev.target.value.length)
                setNewTaskName(ev.target.value)
              }}
            />
            <button className="button" data-testid="add-task-btn" disabled={disableAddTaskBtn}>
              Add task
            </button>
          </InputAndButton>
        </NewTaskForm>
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
          data={
            selectedTask || {
              projId: project.id,
              name: newTaskName,
            }
          }
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
