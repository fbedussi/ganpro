import React from 'react'
import ReactDOM from 'react-dom/client'
import { store } from './store'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Projects from './pages/projects/Projects'
import Tasks from './pages/tasks/Tasks'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Projects />,
    },
    {
      path: '/projects',
      element: <Projects />,
    },
    {
      path: '/projects/:projId',
      element: <Tasks />,
    },
  ],
  { basename: '/ganpro' },
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
