import React, { memo } from 'react'
import styled from 'styled-components'
import colors from '../colors'

interface Props {
  id?: string
  name?: string
  ref?: React.RefObject<HTMLInputElement>
  type?: 'text' | 'number' | 'password'
  readonly?: boolean
  disabled?: boolean
  placeholder?: string
  defaultValue?: string
  hasError?: boolean
  errorMessage?: string
  onChange?: (e: any) => void
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
  hasError = false,
  errorMessage,
  onChange
}) => {
  return (
    <InputBox>
      <Input
        id={id}
        name={name}
        ref={ref}
        type={type}
        readOnly={readonly}
        disabled={disabled}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(e) => {
          onChange && onChange(e)
        }}
      />
      {hasError && (
        <ErrorMessage>{errorMessage}</ErrorMessage>
      )}
    </InputBox>
  )
}

const InputBox = styled.div`
  margin: 0 0 10px;
`

const Input = styled.input<{readOnly: boolean}>`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  resize: none;
  width: 100%;
  height: 1.5rem;
  padding: 0 0 8px;
  border: 0;
  outline: none;
  background: transparent;
  color: #ffffff;
  border-bottom: 1px solid rgba(255,255,255,0.3);

  ${({readOnly}) => readOnly && `
    color: rgba(255,255,255,0.3);
    font-size: 10px;
    border: none;
  `}
`

const ErrorMessage = styled.span`
  display: block;
  margin: 5px 0 0;
  color: ${colors.red};
  font-size: 10px;
`

export default memo(InputField)
