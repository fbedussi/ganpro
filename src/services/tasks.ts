import { createApi } from '@reduxjs/toolkit/query/react'
import { queryIndexedDb } from './queryIndexedDb'
import { Task } from '../model/task'
import { Id } from '../model/types'

const TAG = 'tasks'

export const tasksApi = createApi({
  reducerPath: 'tasks',
  tagTypes: [TAG],
  baseQuery: queryIndexedDb('tasks'),
  endpoints: builder => ({
    getTask: builder.query<Task, Id>({
      query: id => ({
        query: id,
        operation: 'read',
      }),
    }),

    getTasksByProject: builder.query<Task[], Id>({
      query: projId => ({
        query: {
          projId,
        },
        operation: 'readAll',
      }),
      providesTags: [TAG],
    }),

    addTask: builder.mutation<Task, Omit<Task, 'id'>>({
      query: task => ({
        query: task,
        operation: 'create',
      }),
      invalidatesTags: [TAG],
    }),
  }),
})

export const { useGetTaskQuery, useGetTasksByProjectQuery, useAddTaskMutation } = tasksApi
