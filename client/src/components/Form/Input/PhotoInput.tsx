import { Box, Icon, Image } from '@chakra-ui/react'
import React, { useEffect, FC, useRef, useState, SyntheticEvent, ChangeEvent } from 'react'
import { BiImageAdd } from "react-icons/bi"
import { staticFile } from '../../../axios'

interface PhotoInputProps {
    setValue: (e) => void
    defaultVal?: string
}

const PhotoInput:FC<PhotoInputProps> = ({setValue, defaultVal=""}) => {
    const inputRef = useRef<HTMLInputElement>()
    const [file, setFile] = useState<string>()

    useEffect(() => {
        if (defaultVal) {
            setFile(staticFile(defaultVal))
        }
    }, [])
    
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.currentTarget) return
        setValue(e.currentTarget.files[0])
        setFile(URL.createObjectURL(e.currentTarget.files[0]))
    }

  return (
    <>
        <input type='file' ref={inputRef} onChange={handleChange} style={{ display: 'none' }}></input>
        { inputRef.current && 
            <Box
                onClick={() => inputRef.current?.click()}
                w="100%"
                h="100%"
                bgColor="gray.600"
                _hover={{filter: "brightness(0.8)"}}
                transitionDuration="0.25s"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {inputRef.current.files[0] ?
                    <Image h="100%" w="100%" src={file}/>
                    :
                    <Icon h="40%" w="40%" as={BiImageAdd}/>
                }
            </Box>
        }
    </>
  )
}

export default PhotoInput