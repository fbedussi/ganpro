import { Link } from 'react-router-dom'
import { Project } from '../../model/project'
import React from 'react'
import { ChevronRight } from '../../styleguide/icons/ChevronRight'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <article>
      <StyledLink to={`/projects/${project.id}`}>
        <span>{project.name}</span>
        <ChevronRight />
      </StyledLink>
    </article>
  )
}

export default ProjectCard
