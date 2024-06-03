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

  it('validates on blur if a validator is passed and the validateOnBlur prop is true', async () => {
    const { user } = render(
      <div>
        <Select
          label="foo"
          options={[
            { label: 'one', value: 'one' },
            { label: 'two', value: 'two' },
          ]}
          validator={() => 'not valid'}
          validateOnBlur
        />
        <input />
      </div>,
    )
    await user.selectOptions(screen.getByRole('combobox'), 'one')
    await user.type(screen.getByRole('textbox'), 'a')
    expect(screen.getByRole('combobox')).toBeInvalid()
  })

  it('when invalid, changing the value reset the invalid state', async () => {
    const { user } = render(
      <div>
        <Select
          label="foo"
          options={[
            { label: 'one', value: 'one' },
            { label: 'two', value: 'two' },
          ]}
          validator={() => 'not valid'}
          validateOnBlur
        />
        <input />
      </div>,
    )
    await user.selectOptions(screen.getByRole('combobox'), 'one')
    await user.type(screen.getByRole('textbox'), 'a')
    expect(screen.getByRole('combobox')).toBeInvalid()
    await user.selectOptions(screen.getByRole('combobox'), 'two')
    expect(screen.getByRole('combobox')).not.toBeInvalid()
  })
})
