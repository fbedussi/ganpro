import React from 'react'
import { render, screen } from '../test-utils'
import Header from './Header'

describe('Header', () => {
  it('displays the title', () => {
    render(<Header title="foo" />)
    expect(screen.getByText('foo')).toBeInTheDocument()
  })

  it('displays the pre element', () => {
    render(<Header title="foo" pre={<div data-testid="pre" />} />)
    expect(screen.getByTestId('pre')).toBeInTheDocument()
  })

  it('displays the post element', () => {
    render(<Header title="foo" post={<div data-testid="post" />} />)
    expect(screen.getByTestId('post')).toBeInTheDocument()
  })
})
