import React, { ReactElement } from 'react'
import { RenderOptions, render } from '@testing-library/react'
import { store } from './store'
import { Provider } from 'react-redux'

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// re-export everything
export * from '@testing-library/react'

export * from '@testing-library/react'
export { customRender as render }
