import { queryIndexedDb } from '../../src/services/queryIndexedDb'

const proj1 = 'proj1'
let projId: number | undefined

const task1 = 'task1'
const task2 = 'task2'

before(async () => {
  const queryFnProj = queryIndexedDb('projects')
  const allProjects = await queryFnProj({ operation: 'readAll', query: undefined })
  await Promise.all(
    allProjects.data?.map(project => {
      queryFnProj({ query: project.id, operation: 'delete' })
    }),
  )
  const { data } = await queryFnProj({ query: { name: proj1 }, operation: 'create' })
  projId = data
  const queryFnTasks = queryIndexedDb('tasks')
  const allTasks = await queryFnTasks({ operation: 'readAll', query: undefined })
  await Promise.all(
    allTasks?.data?.map(task => {
      queryFnTasks({ query: task.id, operation: 'delete' })
    }),
  )
  await queryFnTasks({ query: { name: task1, projId }, operation: 'create' })
  await queryFnTasks({ query: { name: task2, projId }, operation: 'create' })
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
    cy.get('form').contains('label', 'start date').find('input').type('2024-04-04')
    cy.get('form').contains('label', 'length').find('input').type('2')
    cy.get('form').contains('label', 'assignee').find('input').type('foo')
    cy.get('button[type="submit"]').click()
    cy.contains('task3')
  })
})
