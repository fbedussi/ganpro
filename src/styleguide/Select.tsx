import React, { useEffect, useRef } from 'react'
import { HTMLProps } from 'react'
import styled from 'styled-components'

const Label = styled.label`
  select {
    width: 100%;
  }
`

export const Select = ({
  label,
  options,
  error,
  ...props
}: {
  label?: string
  options: { label: string; value: string }[]
  error?: string
} & HTMLProps<HTMLSelectElement>) => {
  const ref = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    ref.current?.setCustomValidity(error || '')
    ref.current?.reportValidity()
  }, [error])

  return (
    <Label>
      {!!label && <span>{label}</span>}
      <select {...props} ref={ref}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </Label>
  )
}
