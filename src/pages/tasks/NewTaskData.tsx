import styled from 'styled-components'
import { Task } from '../../model/task'
import { Id } from '../../model/types'
import { Button } from '../../styleguide/Button'
import { Input } from '../../styleguide/Input'
import { Select } from '../../styleguide/Select'
import { getRandomColor } from './helpers'

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`

const Buttons = styled.div`
  grid-column: 1/3;
`

const NewTaskData = ({
  taskName,
  projId,
  projectTasks,
  saveTask,
}: {
  projId: Id
  taskName: string
  projectTasks: Task[]
  saveTask: (task: Omit<Task, 'id'>) => void
}) => {
  return (
    <Form
      data-testid="task-details-form"
      onSubmit={ev => {
        ev.preventDefault()
        const form = ev.target as HTMLFormElement
        const nameInput = form.elements[0] as HTMLInputElement
        const startInput = form.elements[1] as HTMLInputElement
        const lengthInput = form.elements[2] as HTMLInputElement
        const assigneeInput = form.elements[3] as HTMLInputElement
        const dependenciesSelect = form.elements[4] as HTMLSelectElement
        saveTask({
          name: nameInput.value,
          projId,
          startDate: new Date(startInput.value),
          length: Number(lengthInput.value),
          assignee: assigneeInput.value,
          dependenciesId: ([] as string[])
            .concat(dependenciesSelect.value)
            .filter(val => val !== '')
            .map(n => Number(n)),
          color: getRandomColor(),
        })
      }}
    >
      <Input label="name" defaultValue={taskName} required />
      <Input label="start date" type="date" required />
      <Input label="length" type="number" required />
      <Input label="assignee" type="text" />
      <Select
        label="dependencies"
        multiple
        options={[{ value: '', label: '' }].concat(
          projectTasks.map(({ name, id }) => ({ value: id.toString(), label: name })),
        )}
      />

      <Buttons>
        <Button type="submit">save</Button>
      </Buttons>
    </Form>
  )
}

export default NewTaskData
