import { FormControl, FormLabel, Input, FormErrorMessage, InputProps, keyframes, Select, SelectProps } from '@chakra-ui/react'
import { Field, useField } from 'formik'
import React, { FC, useEffect, useRef } from 'react'
import { Album } from '../../../models/Album'

interface SelectFieldProps<T> extends SelectProps {
    fieldName: string,
    label?: string,
    options: T[],
    defaultOption?: string
}

const SelectField:FC<SelectFieldProps<Album>> = ({fieldName, options, defaultOption, label, ...props}) => {
    const [field, {error, touched}, {setValue}] = useField(fieldName)

    useEffect(() => {
        setValue(defaultOption ? defaultOption : options[0].id)
    }, [])
    
  return (
    <Field>
        {() => (
            <FormControl transitionDuration="2s" isInvalid={error && touched}>
            <FormLabel>{label || fieldName[0].toUpperCase()+fieldName.slice(1)}</FormLabel>
            <Select
                mb={error && touched ? 0 : 6}
                variant="filled"
                {...field}
                {...props}
            >
                {
                    options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)
                }
            </Select>
            <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        )}
    </Field>
  )
}

export default SelectField