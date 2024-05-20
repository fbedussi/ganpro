import styled from 'styled-components'
import { Task } from '../../model/task'
import { Button } from '../../styleguide/Button'
import { Input } from '../../styleguide/Input'
import { Select } from '../../styleguide/Select'
import { ONE_DAY, calculateTaskLength, getHolidaysClass, getRandomColor } from './helpers'
import React from 'react'

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  input,
  select {
    width: 100%;
  }
`

const Buttons = styled.div`
  grid-column: 1/3;
`

const hd = getHolidaysClass('IT')

const TaskData = ({
  data,
  projectTasks,
  saveTask,
  updateTask,
}: {
  data: Task | Pick<Task, 'name' | 'projId'>
  projectTasks: Task[]
  saveTask: (task: Omit<Task, 'id'>) => void
  updateTask: (task: Task) => void
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

        const startDate = new Date(startInput.value)
        const length = Number(lengthInput.value)
        const effectiveLength = calculateTaskLength({ startDate, length }, hd)
        const endDate = new Date(startDate.getTime() + ONE_DAY * (effectiveLength - 1))

        if ('id' in data) {
          updateTask({
            ...data,
            name: nameInput.value,
            projId: data.projId,
            startDate,
            endDate,
            length,
            effectiveLength,
            assignee: assigneeInput.value,
            dependenciesId: ([] as string[])
              .concat(dependenciesSelect.value)
              .filter(val => val !== '')
              .map(n => Number(n)),
            color: 'color' in data ? data.color : getRandomColor(),
          })
        } else {
          saveTask({
            name: nameInput.value,
            projId: data.projId,
            startDate,
            endDate,
            length,
            effectiveLength,
            assignee: assigneeInput.value,
            dependenciesId: ([] as string[])
              .concat(dependenciesSelect.value)
              .filter(val => val !== '')
              .map(n => Number(n)),
            color: getRandomColor(),
          })
        }
      }}
    >
      <Input label="Name" defaultValue={data.name} required />
      <Input
        label="Start date"
        type="date"
        defaultValue={'startDate' in data ? data.startDate.toISOString().split('T')[0] : undefined}
        required
      />
      <Input
        label="Length"
        type="number"
        defaultValue={'length' in data ? data.length.toString() : '1'}
        required
      />
      <Input label="Assignee" type="text" defaultValue={'assignee' in data ? data.assignee : ''} />
      <Select
        label="Dependencies"
        multiple
        defaultValue={'dependenciesId' in data ? data.dependenciesId.map(id => id.toString()) : []}
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

export default TaskData
