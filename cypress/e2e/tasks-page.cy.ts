import { queryIndexedDb } from '../../src/services/queryIndexedDb'
import { Project, Task } from '../../src/model'

const proj1 = 'proj1'
let projId: number | undefined

const task1Name = 'task1'
const task2 = 'task2'
let task1Id: number | undefined

let taskData: Omit<Task, 'id'>

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

  taskData = {
    name: task1Name,
    projId: projId!,
    startDate: new Date('2024-04-04'),
    endDate: new Date('2024-04-04'),
    assignee: 'foo',
    length: 1,
    effectiveLength: 1,
    dependenciesId: [],
    color: 'red',
  }

  const task1CreationResult = await queryFnTasks({
    query: taskData,
    operation: 'create',
  })
  task1Id = task1CreationResult.data

  await queryFnTasks({
    query: {
      name: task2,
      projId,
      startDate: new Date('2024-04-05'),
      endDate: new Date('2024-04-08'),
      length: 2,
      effectiveLength: 4,
      dependenciesId: [task1Id],
      color: 'green',
    },
    operation: 'create',
  })
})

describe('Listing Tasks', () => {
  it('shows the list of tasks when the user clicks on a project', () => {
    cy.visit('/ganpro/')
    cy.contains(proj1).click()
    cy.contains(task1Name)
    cy.contains(task2)
  })
})

describe('Add a task to a project', () => {
  it('Adds a task', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get('[data-testid="new-task-input"]').type('task3')
    cy.get('[data-testid="add-task-btn"]').click()
    cy.get('dialog').should('be.visible')
    cy.get('form')
      .contains('label', /start date/i)
      .find('input')
      .type('2024-04-08')
    cy.get('form')
      .contains('label', /length/i)
      .find('input')
      .type('3')
    cy.get('form')
      .contains('label', /assignee/i)
      .find('input')
      .type('foo')
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

describe('Open Task details', () => {
  it('opens the modal', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.contains(task1Name).click()
    cy.get('dialog').should('be.visible')
  })

  it('the modal is populated with task data', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.contains(task1Name).click()
    cy.get('form')
      .contains('label', /start date/i)
      .find('input')
      .should('have.value', taskData.startDate.toISOString().split('T')[0])
    cy.get('form')
      .contains('label', /length/i)
      .find('input')
      .should('have.value', taskData.length)
    cy.get('form')
      .contains('label', /assignee/i)
      .find('input')
      .should('have.value', taskData.assignee)
  })

  it('reopens the task details form', async () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get(task1Name).click()
    cy.get('[data-testid="task-details-form"]').should('be.visible')
    cy.get('[data-testid="close-button"]').click()
    cy.get('[data-testid="task-details-form"]').should('not.be.visible')
    cy.get(task1Name).click()
    cy.get('[data-testid="task-details-form"]').should('be.visible')
  })
})

describe('update a task', () => {
  it('updates the task data, after the task update the modal il closed and can be reopened', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get(`[data-testid="task-${task1Name}"]`).click()
    cy.get('form').contains('label', /name/i).find('input').clear().type('task1_bis')
    cy.get('button[type="submit"]').click()
    cy.get('[data-testid="task-details-form"]').should('not.be.visible')
    cy.contains('task1_bis').click()
    cy.get('[data-testid="task-details-form"]').should('be.visible')
  })
})

describe('back button', () => {
  it('leads to the home page', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get('[data-testid="back-button"]').click()
    cy.location('pathname').should('eq', '/ganpro')
  })
})

describe('task constraints', () => {
  it('cannot start a task in a non working day', () => {
    cy.visit(`/ganpro/projects/${projId}`)
    cy.get('[data-testid="new-task-input"]').type('task4')
    cy.get('[data-testid="add-task-btn"]').click()
    cy.get('form')
      .contains('label', /start date/i)
      .find('input')
      .type('2024-04-06')
    cy.get('form')
      .contains('label', /length/i)
      .find('input')
      .type('3')
    cy.get('form')
      .contains('label', /assignee/i)
      .find('input')
      .type('foo')
    cy.get('button[type="submit"]').click()
    cy.contains('[data-testid="task-start-error"]')
  })
})
