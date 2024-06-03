import React, { useRef } from 'react'
import { HTMLProps } from 'react'

export const Select = ({
  label,
  options,
  validator,
  validateOnBlur,
  ...props
}: {
  label?: string
  options: { label: string; value: string }[]
  validator?: (value: string | string[]) => string
  validateOnBlur?: boolean
} & HTMLProps<HTMLSelectElement>) => {
  const ref = useRef<HTMLSelectElement>(null)

  return (
    <label>
      {!!label && <span>{label}</span>}
      <select
        {...props}
        ref={ref}
        onBlur={ev => {
          if (validateOnBlur && validator) {
            const value = props.multiple
              ? Array.from(ev.currentTarget.selectedOptions).map(o => o.value)
              : ev.currentTarget.value
            const error = validator(value)
            ref.current?.setCustomValidity(error || '')
            ref.current?.reportValidity()
          }
        }}
        onChange={(...args) => {
          if (validateOnBlur && validator) {
            ref.current?.setCustomValidity('')
            ref.current?.reportValidity()
          }
          props.onChange && props.onChange(...args)
        }}
      >
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
