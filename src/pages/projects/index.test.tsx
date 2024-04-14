import { _Projects } from '.'
import { render, screen } from '../../test-utils'
import 'fake-indexeddb/auto'

describe('projects page', () => {
  const projects = [
    {
      id: 1,
      name: 'foo',
    },
    {
      id: 2,
      name: 'baz',
    },
  ]

  it('displays the title', () => {
    render(<_Projects projects={projects} />)
    expect(screen.getByText(/projects/i)).toBeInTheDocument()
  })

  it('displays the projects', () => {
    render(<_Projects projects={projects} />)
    expect(screen.getByText(projects[0].name)).toBeInTheDocument()
    expect(screen.getByText(projects[1].name)).toBeInTheDocument()
  })
})
