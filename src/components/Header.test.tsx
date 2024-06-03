import React from 'react'
import { render, screen } from '../test-utils'
import Header from './Header'

describe('Header', () => {
  it('displays the title', () => {
    render(<Header title="foo" />)
    expect(screen.getByText('foo')).toBeInTheDocument()
  })
})
