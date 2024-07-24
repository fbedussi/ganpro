import styled from 'styled-components'
import { Id, Task } from '../../model'
import { Button } from '../../styleguide/Button'
import { useDeleteTaskMutation } from '../../services/tasks'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Buttons = styled.div`
  display: flex;
  justify-content: space-around;
`

export const _ConfirmDeleteTaskModal = ({
  taskToDelete,
  onAbort,
  deleteTask,
}: {
  taskToDelete?: Task
  onAbort: () => void
  deleteTask: (id: Id) => void
}) => {
  return !taskToDelete ? null : (
    <Wrapper data-testid="confirm-delete-task-modal">
      <div>Are you sure you want to delete task {taskToDelete.name}?</div>

      <Buttons>
        <Button data-testid="abort-btn" onClick={onAbort}>
          cancel
        </Button>
        <Button
          data-testid="ok-btn"
          onClick={() => {
            deleteTask(taskToDelete.id)
            onAbort()
          }}
        >
          OK
        </Button>
      </Buttons>
    </Wrapper>
  )
}

const ConfirmDeleteTaskModal = ({
  taskToDelete,
  onAbort,
}: {
  taskToDelete?: Task
  onAbort: () => void
}) => {
  const [deleteTask] = useDeleteTaskMutation()

  return (
    <_ConfirmDeleteTaskModal
      taskToDelete={taskToDelete}
      onAbort={onAbort}
      deleteTask={deleteTask}
    />
  )
}

export default ConfirmDeleteTaskModal
