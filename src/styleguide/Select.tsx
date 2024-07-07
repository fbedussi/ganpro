import React, { useEffect, useRef } from 'react'
import { HTMLProps } from 'react'

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
    <label>
      {!!label && <span>{label}</span>}
      <select {...props} ref={ref}>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
