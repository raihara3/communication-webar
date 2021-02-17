import React, { memo } from 'react'
import styled from 'styled-components'

interface Props {
  id?: string
  name?: string
  ref?: any
  type?: 'text' | 'number' | 'password'
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  defaultValue?: string
  onChange: (e: any) => void
}

const InputField: React.FC<Props> = ({
  id,
  name,
  ref,
  type = 'text',
  readonly = false,
  disabled = false,
  placeholder,
  defaultValue,
  onChange
}) => {
  return (
    <Input
      id={id}
      name={name}
      ref={ref}
      type={type}
      readOnly={readonly}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={(e) => onChange(e)}
    />
  )
}

const Input = styled.input<{readOnly: boolean}>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
  width: 100%;
  height: 1.5rem;
  margin: 0 0 10px;
  padding: 0 0 8px;
  border: 0;
  outline: none;
  background: transparent;
  color: #ffffff;
  border-bottom: 1px solid rgba(255,255,255,0.3);

  ${({readOnly}) => readOnly && `
    color: rgba(255,255,255,0.3);
    font-size: 10px;
  `}
`

export default memo(InputField)
