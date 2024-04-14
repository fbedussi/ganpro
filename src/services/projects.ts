import { createApi } from '@reduxjs/toolkit/query/react'
import { queryIndexedDb } from './queryIndexedDb'
import { Project } from '../model/project'

export const projectsApi = createApi({
  reducerPath: 'projects',
  baseQuery: queryIndexedDb('projects'),
  endpoints: builder => ({
    getProject: builder.query<Project, number>({
      query: id => ({
        query: id,
        operation: 'read',
      }),
    }),

    getAllProjects: builder.query<Project[], void>({
      query: () => ({
        query: undefined,
        operation: 'read',
      }),
    }),

    addProject: builder.query<Project, Omit<Project, 'id'>>({
      query: project => ({
        query: project,
        operation: 'create',
      }),
    }),
  }),
})

export const { useGetProjectQuery } = projectsApi
