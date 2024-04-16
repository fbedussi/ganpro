import { _Projects } from './projects'
import { render, screen } from '../../test-utils'
import userEvent from '@testing-library/user-event'

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
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    expect(screen.getByText(/projects/i)).toBeInTheDocument()
  })

  it('displays the projects', () => {
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    expect(screen.getByText(projects[0].name)).toBeInTheDocument()
    expect(screen.getByText(projects[1].name)).toBeInTheDocument()
  })

  it('displays an new project input', () => {
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    expect(screen.getByTestId('new-project-input')).toBeInTheDocument()
  })

  it('displays an add project button', () => {
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    expect(screen.getByTestId('save-project-btn')).toBeInTheDocument()
  })

  it('the add project button is disable until the new project input is blank', async () => {
    const user = userEvent.setup()
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    expect(screen.getByTestId('save-project-btn')).toBeDisabled()
    await user.type(screen.getByTestId('new-project-input'), 'new project')
    expect(screen.getByTestId('save-project-btn')).toBeEnabled()
  })

  it('adds a new project', async () => {
    const user = userEvent.setup()
    const saveNewProject = jest.fn()
    render(<_Projects projects={projects} saveNewProject={saveNewProject} />)
    await user.type(screen.getByTestId('new-project-input'), 'new project')
    await user.click(screen.getByTestId('save-project-btn'))
    expect(saveNewProject).toHaveBeenCalled()
  })

  it('adding a project the new project input is cleared out', async () => {
    const user = userEvent.setup()
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    const newProjectInput = screen.getByTestId('new-project-input') as HTMLInputElement
    await user.type(newProjectInput, 'new project')
    await user.click(screen.getByTestId('save-project-btn'))
    expect(newProjectInput.value).toBe('')
  })

  it('adding a project the save project button is disabled', async () => {
    const user = userEvent.setup()
    render(<_Projects projects={projects} saveNewProject={jest.fn()} />)
    const newProjectInput = screen.getByTestId('new-project-input') as HTMLInputElement
    const saveProjectButton = screen.getByTestId('save-project-btn')
    await user.type(newProjectInput, 'new project')
    await user.click(saveProjectButton)
    expect(saveProjectButton).toBeDisabled()
  })
})
