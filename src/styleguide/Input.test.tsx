import React from 'react'
import { render, screen } from '../test-utils'
import { Input } from './Input'

describe('input', () => {
  it('shows the label and the input', () => {
    render(<Input label="foo" />)
    expect(screen.getByRole('textbox', { name: 'foo' })).toBeInTheDocument()
  })
})
