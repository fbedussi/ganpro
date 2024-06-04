import React, { useEffect, useRef } from 'react'
import { HTMLProps } from 'react'
import styled from 'styled-components'

const Label = styled.label`
  &:has(input[required]) span::after {
    content: '*';
  }

  input:invalid {
    border-color: var(--pico-form-element-invalid-active-border-color);
  }
`

export const Input = ({
  label,
  error,
  ...props
}: {
  label?: string
  error?: string
} & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.setCustomValidity(error || '')
    ref.current?.reportValidity()
  }, [error])

  return (
    <Label>
      {!!label && <span>{label}</span>}
      <input {...props} ref={ref} onFocus={ev => ev.target.select()} />
    </Label>
  )
}
