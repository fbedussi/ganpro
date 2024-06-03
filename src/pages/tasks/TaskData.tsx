import styled from 'styled-components'
import { Task } from '../../model/task'
import { Button } from '../../styleguide/Button'
import { Input } from '../../styleguide/Input'
import { Select } from '../../styleguide/Select'
import {
  ONE_DAY,
  calculateTaskLength,
  getHolidaysClass,
  getNonEndedDependencies,
  getRandomColor,
  isWeekend,
} from './helpers'
import React, { useState } from 'react'

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
  const [values, setValues] = useState({
    name: data.name,
    startDate: 'startDate' in data ? data.startDate : new Date(),
    length: 'length' in data ? data.length : 1,
    assignee: 'assignee' in data ? data.assignee : '',
    dependenciesId: 'dependenciesId' in data ? data.dependenciesId : [],
  })

  return (
    <Form
      data-testid="task-details-form"
      onSubmit={ev => {
        ev.preventDefault()
        const effectiveLength = calculateTaskLength(values, hd)
        const endDate = new Date(values.startDate.getTime() + ONE_DAY * (effectiveLength - 1))

        if ('id' in data) {
          updateTask({
            ...data,
            ...values,
            endDate,
            effectiveLength,
            color: 'color' in data ? data.color : getRandomColor(),
          })
        } else {
          saveTask({
            ...data,
            ...values,
            endDate,
            effectiveLength,
            color: getRandomColor(),
          })
        }
      }}
    >
      <Input
        label="Name"
        value={values.name}
        required
        onChange={ev =>
          setValues({
            ...values,
            name: ev.currentTarget.value,
          })
        }
      />
      <Input
        label="Start date"
        type="date"
        value={values.startDate.toISOString().split('T')[0]}
        onChange={ev => {
          setValues({
            ...values,
            startDate: new Date(ev.currentTarget.value),
          })
        }}
        required
        validateOnBlur
        validator={startDate => {
          const nonEndedDependencies = getNonEndedDependencies(
            projectTasks,
            values.dependenciesId,
            startDate,
          )

          const errors = [
            isWeekend(startDate) && 'Start date cannot be a weekend day',
            hd.isHoliday(startDate) && 'Start date cannot be a holiday',
            !!nonEndedDependencies.length &&
              'A task cannot start before the tasks it depends on are ended',
          ]

          const error = errors.find(error => typeof error === 'string') || ''

          return error
        }}
      />
      <Input
        label="Length"
        name="length"
        type="number"
        value={values.length.toString()}
        onChange={ev => {
          setValues({
            ...values,
            length: Number(ev.currentTarget.value),
          })
        }}
        required
      />
      <Input
        label="Assignee"
        type="text"
        value={values.assignee}
        onChange={ev =>
          setValues({
            ...values,
            assignee: ev.currentTarget.value,
          })
        }
      />
      <Select
        label="Dependencies"
        multiple
        value={values.dependenciesId.map(id => id.toString())}
        onChange={ev => {
          setValues({
            ...values,
            dependenciesId: Array.from(ev.currentTarget.selectedOptions).map(o => Number(o.value)),
          })
        }}
        options={[{ value: '', label: '' }].concat(
          projectTasks
            .filter(({ id }) => ('id' in data ? id !== data.id : true))
            .map(({ name, id }) => ({ value: id.toString(), label: name })),
        )}
        validator={dependenciesId => {
          const nonEndedDependencies = getNonEndedDependencies(
            projectTasks,
            Array.from(dependenciesId).map(id => Number(id)),
            values.startDate,
          )

          return nonEndedDependencies.length
            ? nonEndedDependencies.map(({ name }) => `${name} ends after the task start`).join(', ')
            : ''
        }}
        validateOnBlur
      />

      <Buttons>
        <Button type="submit">save</Button>
      </Buttons>
    </Form>
  )
}

export default TaskData
