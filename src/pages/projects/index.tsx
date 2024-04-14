import { Project } from '../../model/project'
import { useGetAllProjectsQuery } from '../../services/projects'
import ProjectCard from './ProjectCard'

export const _Projects = ({ projects }: { projects: Project[] }) => {
  return (
    <>
      <h1>Projects</h1>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </>
  )
}

const Projects = () => {
  const { data } = useGetAllProjectsQuery()

  return <_Projects projects={data || []} />
}

export default Projects
