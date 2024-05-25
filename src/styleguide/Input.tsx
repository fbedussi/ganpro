import React, { useRef } from 'react'
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
  validator,
  validateOnBlur,
  ...props
}: {
  label?: string
  validator?: (value: string) => string
  validateOnBlur?: boolean
} & HTMLProps<HTMLInputElement>) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <Label>
      {!!label && <span>{label}</span>}
      <input
        {...props}
        ref={ref}
        onFocus={ev => ev.target.select()}
        onBlur={ev => {
          if (validateOnBlur && validator) {
            const error = validator(ev.target.value)
            ref.current?.setCustomValidity(error || '')
            ref.current?.reportValidity()
          }
        }}
      />
    </Label>
  )
}
