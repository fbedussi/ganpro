import React, { ReactElement } from 'react'
import { RenderOptions, render } from '@testing-library/react'
import { store } from './store'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'

const AllTheProviders = ({ children, route }: { children: React.ReactNode; route?: string }) => {
  return (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route || '/']}>{children}</MemoryRouter>
    </Provider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { route?: string },
) => render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'
export { customRender as render }
