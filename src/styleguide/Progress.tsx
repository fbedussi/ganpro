import { HTMLProps } from 'react'

export const Progress = (props: HTMLProps<HTMLProgressElement>) => {
  return <progress {...props}></progress>
}
