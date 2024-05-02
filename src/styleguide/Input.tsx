import React from 'react'
import { HTMLProps } from 'react'

export const Input = ({
  label,
  ...props
}: {
  label?: string
} & HTMLProps<HTMLInputElement>) => {
  return (
    <label>
      {!!label && <span>{label}</span>}
      <input {...props} />
    </label>
  )
}
