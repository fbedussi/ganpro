import styled from 'styled-components'
import { Task } from '../../model'
import { Button } from '../../styleguide/Button'
import { getLocalizedDateShort } from '../../helpers/time'
import { ONE_DAY } from './helpers'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Footer = styled.div`
  display: flex;
  justify-content: center;
`

const DependencyWarning = ({
  taskName,
  taskEndDate,
  dependenciesToBeFixed,
  onOk,
}: {
  taskName: string
  taskEndDate: Date
  dependenciesToBeFixed: Task[]
  onOk: () => void
}) => {
  return (
    <Wrapper data-testid="dependency-warning">
      <div>These tasks start before task {taskName} ends:</div>
      <table>
        <thead>
          <tr>
            <td>Task Name</td>
            <td>Start Date</td>
          </tr>
        </thead>
        <tbody>
          {dependenciesToBeFixed.map(({ id, name, startDate }) => (
            <tr key={id}>
              <td>{name}</td>
              <td>{getLocalizedDateShort(startDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        Their start date will be moved to{' '}
        <span>{getLocalizedDateShort(new Date(taskEndDate.getTime() + ONE_DAY))}</span>.
      </div>
      <Footer>
        <Button data-testid="fix-dependencies-button" onClick={onOk}>
          OK
        </Button>
      </Footer>
    </Wrapper>
  )
}

export default DependencyWarning
