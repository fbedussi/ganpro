import { ChangeEvent, useState } from 'react'
import { Project } from '../../model/project'
import { useAddProjectMutation, useGetAllProjectsQuery } from '../../services/projects'
import ProjectCard from './ProjectCard'
import React from 'react'
import Header from '../../components/Header'
import styled from 'styled-components'

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputAndButton = styled.div`
  display: flex;
  gap: 1rem;

  input {
    flex: 1;
  }

  button {
    width: fit-content;
  }
`

export const _Projects = ({
  projects,
  saveNewProject,
}: {
  projects: Project[]
  saveNewProject: (project: Omit<Project, 'id'>) => void
}) => {
  const [disableAddProjectBtn, setDisableAddProjectBtn] = useState(true)
  const [newProjectName, setNewProjectName] = useState('')

  return (
    <>
      <Header pre={<span></span>} title="Projects" />

      <Main className="container">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}

        <form
          onSubmit={ev => {
            ev.preventDefault()
            saveNewProject({ name: newProjectName })
            setNewProjectName('')
            setDisableAddProjectBtn(true)
          }}
        >
          <label htmlFor="new-project-input">New project</label>
          <InputAndButton>
            <input
              id="new-project-input"
              type="text"
              data-testid="new-project-input"
              value={newProjectName}
              onChange={(ev: ChangeEvent<HTMLInputElement>) => {
                setDisableAddProjectBtn(!ev.target.value.length)
                setNewProjectName(ev.target.value)
              }}
            />
            <button
              className="button"
              data-testid="save-project-btn"
              disabled={disableAddProjectBtn}
            >
              Add project
            </button>
          </InputAndButton>
        </form>
      </Main>
    </>
  )
}

const Projects = () => {
  const { data } = useGetAllProjectsQuery()
  const [saveNewProject] = useAddProjectMutation()

  return <_Projects projects={data || []} saveNewProject={saveNewProject} />
}

export default Projects
