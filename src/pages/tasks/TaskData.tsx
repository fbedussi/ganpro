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
  taskEndsAfterDependantTasks,
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

const INVALID_START_DATE_ERROR = 'A task cannot start before the tasks it depends on are ended'

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

  const [errors, setErrors] = useState({
    dependenciesId: '',
    startDate: '',
  })

  const [dependenciesToBeFixed, setDependenciesToBeFixed] = useState<Task[]>([])

  return dependenciesToBeFixed.length ? (
    <div data-testid="dependency-warning">
      <div>These tasks starts before this task ends:</div>
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
              <td>{startDate.toISOString().split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>Their start date will be moved ahead.</div>
      <Button onClick={() => setDependenciesToBeFixed([])}>OK</Button>
    </div>
  ) : (
    <Form
      data-testid="task-details-form"
      onSubmit={ev => {
        ev.preventDefault()
        const effectiveLength = calculateTaskLength(values, hd)
        const endDate = new Date(values.startDate.getTime() + ONE_DAY * (effectiveLength - 1))

        if ('id' in data) {
          const dependenciesToBeFixed = taskEndsAfterDependantTasks(data.id, endDate, projectTasks)

          if (dependenciesToBeFixed.length) {
            setDependenciesToBeFixed(dependenciesToBeFixed)
          } else {
            updateTask({
              ...data,
              ...values,
              endDate,
              effectiveLength,
              color: 'color' in data ? data.color : getRandomColor(),
            })
          }
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
        error={errors.startDate}
        onChange={ev => {
          const startDate = new Date(ev.currentTarget.value)

          const nonEndedDependencies = getNonEndedDependencies(
            projectTasks,
            values.dependenciesId,
            startDate,
          )

          const errors = [
            isWeekend(startDate) && 'Start date cannot be a weekend day',
            hd.isHoliday(startDate) && 'Start date cannot be a holiday',
            !!nonEndedDependencies.length && INVALID_START_DATE_ERROR,
          ]

          const error = errors.find(error => typeof error === 'string') || ''

          setErrors(errors => ({
            dependenciesId: !nonEndedDependencies.length ? '' : errors.dependenciesId,
            startDate: error,
          }))

          setValues({
            ...values,
            startDate,
          })
        }}
        required
      />
      <Input
        label="Length"
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
        error={errors.dependenciesId}
        onChange={ev => {
          const dependenciesId = Array.from(ev.currentTarget.selectedOptions)
            .filter(o => o.value !== '')
            .map(o => Number(o.value))

          const nonEndedDependencies = getNonEndedDependencies(
            projectTasks,
            dependenciesId,
            values.startDate,
          )

          const error = nonEndedDependencies.length
            ? nonEndedDependencies.map(({ name }) => `${name} ends after the task start`).join(', ')
            : ''

          setErrors({
            startDate:
              errors.startDate === INVALID_START_DATE_ERROR && !nonEndedDependencies.length
                ? ''
                : errors.startDate,

            dependenciesId: error,
          })

          setValues({
            ...values,
            dependenciesId,
          })
        }}
        options={[{ value: '', label: '' }].concat(
          projectTasks
            .filter(({ id }) => ('id' in data ? id !== data.id : true))
            .map(({ name, id }) => ({ value: id.toString(), label: name })),
        )}
      />

      <Buttons>
        <Button type="submit">save</Button>
      </Buttons>
    </Form>
  )
}

export default TaskData
