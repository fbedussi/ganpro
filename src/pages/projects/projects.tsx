import { ChangeEvent, useState } from 'react'
import { Project } from '../../model/project'
import { useAddProjectMutation, useGetAllProjectsQuery } from '../../services/projects'
import ProjectCard from './ProjectCard'

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
      <h1>Projects</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
      <label>
        New project
        <input
          type="text"
          data-testid="new-project-input"
          value={newProjectName}
          onChange={(ev: ChangeEvent<HTMLInputElement>) => {
            setDisableAddProjectBtn(!ev.target.value.length)
            setNewProjectName(ev.target.value)
          }}
        />
      </label>
      <button
        data-testid="save-project-btn"
        disabled={disableAddProjectBtn}
        onClick={() => {
          saveNewProject({ name: newProjectName })
          setNewProjectName('')
          setDisableAddProjectBtn(true)
        }}
      >
        Add project
      </button>
    </>
  )
}

const Projects = () => {
  const { data } = useGetAllProjectsQuery()
  const [saveNewProject] = useAddProjectMutation()

  return <_Projects projects={data || []} saveNewProject={saveNewProject} />
}

export default Projects
