import { queryIndexedDb } from '../../src/services/queryIndexedDb'
import { Project, Task } from '../../src/model'

const proj1 = 'proj1'
let projId: number | undefined

const task1 = 'task1'
const task2 = 'task2'
let task1Id: number | undefined
let task2Id: number | undefined

before(async () => {
  const queryFnProj = queryIndexedDb('projects')
  const allProjects = await queryFnProj({ operation: 'readAll', query: undefined })
  await Promise.all(
    allProjects.data?.map((project: Project) => {
      queryFnProj({ query: project.id, operation: 'delete' })
    }),
  )
  const { data } = await queryFnProj({ query: { name: proj1 }, operation: 'create' })
  projId = data
  const queryFnTasks = queryIndexedDb('tasks')
  const allTasks = await queryFnTasks({ operation: 'readAll', query: undefined })
  await Promise.all(
    allTasks?.data?.map((task: Task) => {
      queryFnTasks({ query: task.id, operation: 'delete' })
    }),
  )
  const task1CreationResult = await queryFnTasks({
    query: { name: task1, projId, startDate: new Date('2024-04-04'), length: 1, color: 'red' },
    operation: 'create',
  })
  task1Id = task1CreationResult.data

  const task2CreationResult = await queryFnTasks({
    query: { name: task2, projId, startDate: new Date('2024-04-05'), length: 2, color: 'green' },
    operation: 'create',
  })
  task2Id = task2CreationResult.data
})

describe('Listing Tasks', () => {
  it('shows the list of tasks when the user clicks on a project', () => {
    cy.visit('/ganpro/')
    cy.contains(proj1).click()
    cy.contains(task1)
    cy.contains(task2)
  })
})

describe('Add a task to a project', () => {
  it('Adds a task', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get('[data-testid="new-task-input"]').type('task3')
    cy.get('[data-testid="add-task-btn"]').click()
    cy.get('dialog').should('be.visible')
    cy.get('form').contains('label', 'start date').find('input').type('2024-04-08')
    cy.get('form').contains('label', 'length').find('input').type('3')
    cy.get('form').contains('label', 'assignee').find('input').type('foo')
    cy.get('button[type="submit"]').click()
    cy.contains('task3')
  })
})

describe('Show the calendar', () => {
  it('The calendar show the the day of the earlier task', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get('[data-testid="calendar"] [data-testid="2024-04-04"]')
  })

  it('The calendar has a taskbar for every task', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get(`[data-testid="calendar"] [data-testid="task-${task1Id}_bar"]`)
  })
})
