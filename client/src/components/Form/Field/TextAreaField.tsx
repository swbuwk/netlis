import { FormControl, FormLabel, FormErrorMessage, Textarea, TextareaProps } from '@chakra-ui/react'
import { Field, useField } from 'formik'
import React, { FC, useEffect } from 'react'

interface TextAreaFieldProps extends TextareaProps {
    fieldName: string
    placeholder?: string
    label?: string
    defaultVal?: string
}

const TextAreaField:FC<TextAreaFieldProps> = ({fieldName, placeholder, label, defaultVal = "", ...props}) => {
    const [field, {error, touched}, {setValue}] = useField(fieldName)

    useEffect(() => {
      setValue(defaultVal)
  }, [])

  return (
    <Field>
        {({}) => (
            <FormControl transitionDuration="2s" isInvalid={error && touched}>
              <FormLabel>{label || fieldName[0].toUpperCase()+fieldName.slice(1)}</FormLabel>
              <Textarea 
                  mb={error && touched ? 0 : 6}
                  variant="filled"
                  placeholder={placeholder} {...field}
                  resize="none"
                  {...props}
                  />
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        )}
    </Field>
  )
}

export default TextAreaField