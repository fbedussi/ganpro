import React from 'react'
import { render, screen } from '../test-utils'
import { Select } from './Select'

describe('Select', () => {
  it('renders the label and the options', () => {
    render(
      <Select
        label="foo"
        options={[
          { label: 'one', value: 'one' },
          { label: 'two', value: 'two' },
        ]}
      />,
    )
    expect(screen.getByRole('combobox', { name: 'foo' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'one' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'two' })).toBeInTheDocument()
  })

  it('is invalid if there is an error', () => {
    render(
      <Select
        label="foo"
        options={[
          { label: 'one', value: 'one' },
          { label: 'two', value: 'two' },
        ]}
        error="error"
      />,
    )
    expect(screen.getByRole('combobox')).toBeInvalid()
  })
})
