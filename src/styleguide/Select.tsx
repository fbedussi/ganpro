import { HTMLProps } from 'react'

export const Select = ({
  label,
  options,
  ...props
}: {
  label?: string
  options: { label: string; value: string }[]
} & HTMLProps<HTMLSelectElement>) => {
  return (
    <label>
      {!!label && <span>{label}</span>}
      <select {...props}>
        {options.map(({ value, label }, index) => (
          <option key={`${value}_${index}`} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
