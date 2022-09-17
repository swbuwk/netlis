import { FormControl, FormLabel, Input, FormErrorMessage, InputProps, keyframes } from '@chakra-ui/react'
import { Field, useField } from 'formik'
import React, { FC, useEffect } from 'react'

interface InputFieldProps extends InputProps {
    fieldName: string
    placeholder?: string
    label?: string
    type?: string
    defaultVal?: string
}

const InputField:FC<InputFieldProps> = ({fieldName, placeholder, label, type, defaultVal = "", ...props}) => {
    const [field, {error, touched}, {setValue}] = useField(fieldName)

    useEffect(() => {
        setValue(defaultVal)
    }, [])

  return (
    <Field>
        {({}) => (
            <FormControl {...props} transitionDuration="2s" isInvalid={error && touched}>
                <FormLabel>{label || fieldName[0].toUpperCase()+fieldName.slice(1)}</FormLabel>
                <Input
                mb={error && touched ? 0 : 6}
                variant='filled'
                placeholder={placeholder || fieldName[0].toUpperCase()+fieldName.slice(1)}
                {...field}
                type={type || "text"}/>
                <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        )}
    </Field>
  )
}

export default InputField