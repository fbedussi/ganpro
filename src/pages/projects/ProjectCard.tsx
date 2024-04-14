import { Project } from '../../model/project'

const ProjectCard = ({ project }: { project: Project }) => {
  return <article>{project.name}</article>
}

export default ProjectCard
