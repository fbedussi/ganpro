// import { queryIndexedDb } from '../../src/services/queryIndexedDb'
describe('Listing Projects', () => {
  // const queryFn = queryIndexedDb('projects')
  const proj1 = 'proj1'
  const proj2 = 'proj2'
  // queryFn({ query: { name: proj1 }, operation: 'create' })
  // queryFn({ query: { name: proj2 }, operation: 'create' })
  it('shows saved projects', () => {
    cy.visit('/ganpro/')
    cy.contains(proj1)
    cy.contains(proj2)
  })
})
