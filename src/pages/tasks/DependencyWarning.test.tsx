import { getLocalizedDateShort } from '../../helpers/time'
import { mockTask } from '../../mocks/task'
import { render, screen } from '../../test-utils'
import DependencyWarning from './DependencyWarning'
import { ONE_DAY } from './helpers'

const endDate = new Date('2024-04-04')

describe('DependencyWarning', () => {
  it('shows the updated task name', () => {
    render(
      <DependencyWarning
        taskName="one"
        taskEndDate={endDate}
        dependenciesToBeFixed={[]}
        onOk={() => {}}
      />,
    )
    expect(screen.getByText(/one/)).toBeInTheDocument()
  })

  it('lists all the dependencies that will be updated', () => {
    const dependencies = [mockTask({ name: 'two' }), mockTask({ name: 'three' })]
    render(
      <DependencyWarning
        taskName="one"
        taskEndDate={endDate}
        dependenciesToBeFixed={dependencies}
        onOk={() => {}}
      />,
    )
    expect(screen.getByText(dependencies[0].name)).toBeInTheDocument()
    expect(screen.getByText(dependencies[1].name)).toBeInTheDocument()
  })

  it('shows the task end date', () => {
    render(
      <DependencyWarning
        taskName="one"
        taskEndDate={endDate}
        dependenciesToBeFixed={[]}
        onOk={() => {}}
      />,
    )
    expect(screen.getByText(getLocalizedDateShort(endDate.getTime() + ONE_DAY))).toBeInTheDocument()
  })

  it('calls onOk when the ok button is clicked', async () => {
    const onOk = jest.fn()
    const { user } = render(
      <DependencyWarning
        taskName="one"
        taskEndDate={endDate}
        dependenciesToBeFixed={[]}
        onOk={onOk}
      />,
    )
    await user.click(screen.getByText(/ok/i))
    expect(onOk).toHaveBeenCalled()
  })
})
