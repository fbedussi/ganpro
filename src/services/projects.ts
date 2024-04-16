import { createApi } from '@reduxjs/toolkit/query/react'
import { queryIndexedDb } from './queryIndexedDb'
import { Project } from '../model/project'

const TAG = 'projects'

export const projectsApi = createApi({
  reducerPath: 'projects',
  tagTypes: [TAG],
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
        operation: 'readAll',
      }),
      providesTags: [TAG],
    }),

    addProject: builder.mutation<Project, Omit<Project, 'id'>>({
      query: project => ({
        query: project,
        operation: 'create',
      }),
      invalidatesTags: [TAG],
    }),
  }),
})

export const { useGetProjectQuery, useGetAllProjectsQuery, useAddProjectMutation } = projectsApi
