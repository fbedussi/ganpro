import { Link } from 'react-router-dom'
import { Project } from '../../model/project'
import React from 'react'

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article>
      <Link to={`/projects/${project.id}`}>{project.name}</Link>
    </article>
  )
}

export default ProjectCard
