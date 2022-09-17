import { FormControl, FormLabel, Switch, SwitchProps } from '@chakra-ui/react'
import { Field, useField } from 'formik'
import React, { FC } from 'react'

interface SwitchFieldProps extends SwitchProps {
    fieldName: string
    label?: string
}

const SwitchField: FC<SwitchFieldProps> = ({fieldName, label}) => {
    const [field, {}, {setValue}] = useField(fieldName)

  return (
    <Field>
        {({}) => (
        <FormControl display='flex' alignItems='center'>
            <FormLabel htmlFor='private-field' mb='0'>
                Private
            </FormLabel>
            <Switch id='private-field' onChange={e => {
                setValue(e.target.checked)
            }}/>
        </FormControl>
        )}
    </Field>
  )
}

export default SwitchField