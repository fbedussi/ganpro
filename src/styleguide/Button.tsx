import React from 'react'
import { ButtonHTMLAttributes } from 'react'

export const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className="button" {...props}>
      {children}
    </button>
  )
}
