import React from 'react'
import { render, screen } from '../test-utils'
import { Input } from './Input'

describe('input', () => {
  it('shows the label and the input', () => {
    render(<Input label="foo" />)
    expect(screen.getByRole('textbox', { name: 'foo' })).toBeInTheDocument()
  })

  it('validates on blur if a validator is passed and the validateOnBlur prop is true', async () => {
    const { user } = render(
      <div>
        <Input label="foo" validator={() => 'not valid'} validateOnBlur />
        <Input label="baz" />
      </div>,
    )
    const fooInput = screen.getByRole('textbox', { name: 'foo' })
    await user.type(fooInput, 'a')
    await user.type(screen.getByRole('textbox', { name: 'baz' }), 'b')
    expect(fooInput).toBeInvalid()
  })

  it('when invalid, changing the value reset the invalid state', async () => {
    const { user } = render(
      <div>
        <Input label="foo" validator={() => 'not valid'} validateOnBlur />
        <Input label="baz" />
      </div>,
    )
    const fooInput = screen.getByRole('textbox', { name: 'foo' })
    await user.type(fooInput, 'a')
    await user.type(screen.getByRole('textbox', { name: 'baz' }), 'b')
    expect(fooInput).toBeInvalid()
    await user.type(fooInput, 'b')
    expect(fooInput).not.toBeInvalid()
  })
})
