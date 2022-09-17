import { FormControl, FormLabel, Input, FormErrorMessage, InputProps, keyframes, Select, SelectProps, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { Field, useField } from 'formik'
import React, { FC, useEffect, useRef } from 'react'
import { Album } from '../../../models/Album'
import AudioInput from '../Input/AudioInput'
import PhotoInput from '../Input/PhotoInput'

export enum FileFieldOptions {
    audio="audio",
    photo="photo"
}

interface FileFieldProps extends InputProps {
    fieldName: string,
    label?: string,
    option: FileFieldOptions
    defaultPhoto?: string
    inputW?: number | string
    inputH?: number | string
}

const FileField:FC<FileFieldProps> = ({fieldName, label, option, defaultPhoto, inputW=150, inputH=150, ...props}) => {
    const [field, {error, touched}, {setValue}] = useField(fieldName)
    
  return (
    <Field>
        {() => (
            <FormControl w="min" {...props} transitionDuration="2s" isInvalid={!!error}>
            <FormLabel>{label || fieldName[0].toUpperCase()+fieldName.slice(1)}</FormLabel>
            <InputGroup
                h={inputH}
                w={inputW}
                mb={error && touched ? 0 : 6}
            >
                {option === FileFieldOptions.photo && <PhotoInput defaultVal={defaultPhoto} setValue={setValue}/>}
                {option === FileFieldOptions.audio && <AudioInput setValue={setValue}/>}
            </InputGroup>
            <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
        )}
    </Field>
  )
}

export default FileField