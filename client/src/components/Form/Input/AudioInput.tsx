import { Box, Heading, Icon, Image } from '@chakra-ui/react'
import React, { useEffect, FC, useRef, useState } from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'

interface AudioInputProps {
    setValue: (e) => void
}

const AudioInput:FC<AudioInputProps> = ({setValue}) => {
    const inputRef = useRef<HTMLInputElement>()
    
    const handleChange = (e) => {
        if (!e.currentTarget) return
        setFileInfo(e.currentTarget.files[0])
    }

    const setFileInfo = async (file) => {
        const audio = document.createElement('audio');
        audio.preload = 'metadata';
        audio.src = URL.createObjectURL(inputRef.current.files[0]);
      
        audio.onloadedmetadata = function() {

            window.URL.revokeObjectURL(audio.src);
            file.duration = audio.duration
            setValue(file)
        }
      }

  return (
    <>
        <input type='file' ref={inputRef} onChange={handleChange} style={{ display: 'none' }}></input>
        { inputRef.current && 
            <Box
                onClick={() => inputRef.current?.click()}
                w="100%"
                h="50px"
                overflow="hidden"
                bgColor="gray.600"
                _hover={{filter: "brightness(0.8)"}}
                transitionDuration="0.25s"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {inputRef.current.files[0] ?
                    <Heading mx="10px" whiteSpace="nowrap" size="sm">{inputRef.current.files[0].name}</Heading>
                    :
                    <Icon h="50%" w="50%" as={AiOutlineCloudUpload}/>
                }
            </Box>
        }
    </>
  )
}

export default AudioInput