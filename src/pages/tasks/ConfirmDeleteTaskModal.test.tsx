import { mockTask } from '../../mocks/task'
import { render, screen } from '../../test-utils'
import { _ConfirmDeleteTaskModal } from './CondirmDeleteTaskModal'

describe('_ConfirmDeleteTaskModal', () => {
  test('the cancel button calls onAbort', async () => {
    const task = mockTask({
      id: 1,
      projId: 1,
      name: 'task1',
      startDate: new Date('2024-04-04'),
      endDate: new Date('2024-04-04'),
      length: 1,
      effectiveLength: 1,
      assignee: 'me',
      dependenciesId: [],
      color: 'red',
    })
    const onAbort = jest.fn()
    const { user } = render(
      <_ConfirmDeleteTaskModal taskToDelete={task} onAbort={onAbort} deleteTask={() => {}} />,
    )

    await user.click(screen.getByTestId('abort-btn'))

    expect(onAbort).toHaveBeenCalled()
  })

  test('the ok button calls deleteTask', async () => {
    const task = mockTask({
      id: 1,
      projId: 1,
      name: 'task1',
      startDate: new Date('2024-04-04'),
      endDate: new Date('2024-04-04'),
      length: 1,
      effectiveLength: 1,
      assignee: 'me',
      dependenciesId: [],
      color: 'red',
    })
    const deleteTask = jest.fn()
    const { user } = render(
      <_ConfirmDeleteTaskModal taskToDelete={task} onAbort={() => {}} deleteTask={deleteTask} />,
    )

    await user.click(screen.getByTestId('ok-btn'))

    expect(deleteTask).toHaveBeenCalledWith(task.id)
  })
})
