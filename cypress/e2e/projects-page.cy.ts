import { queryIndexedDb } from '../../src/services/queryIndexedDb'

const proj1 = 'proj1'
const proj2 = 'proj2'

before(async () => {
  const queryFn = queryIndexedDb('projects')
  const allProjects = await queryFn({ operation: 'readAll', query: undefined })
  await Promise.all(
    allProjects.data.map(project => {
      queryFn({ query: project.id, operation: 'delete' })
    }),
  )
  await queryFn({ query: { name: proj1 }, operation: 'create' })
  await queryFn({ query: { name: proj2 }, operation: 'create' })
})

describe('Listing Projects', () => {
  it('shows saved projects', () => {
    cy.visit('/ganpro/')
    cy.contains(proj1)
    cy.contains(proj2)
  })
})

describe('Add a project', () => {
  it('Adds a project', () => {
    cy.visit('/ganpro/')
    cy.get('[data-testid="new-project-input"]').type('proj3')
    cy.get('[data-testid="save-project-btn"]').click()
    cy.contains('proj3')
  })
})
