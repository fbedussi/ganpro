import { render, screen } from '../../test-utils'
import ProjectCard from './ProjectCard'

describe('ProjectCard', () => {
  test('the projects are links to a project page', () => {
    const project = { id: 1, name: 'proj1' }
    render(<ProjectCard project={project} />)
    expect(screen.getByRole('link', { name: project.name })).toBeInTheDocument()
  })
})
