import { Box, Icon } from '@chakra-ui/react';
import React, { FC } from 'react'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';

interface PauseComponentProps {
    paused: boolean
    pauseVisible: boolean
}

const PauseComponent:FC<PauseComponentProps> = ({paused, pauseVisible}) => {
  return (
    <Box
        pos="absolute"
        w="100%" h="100%"
        borderRadius="5px"
        bgColor={"rgba(0, 0, 0, 0.7)"}
        display="flex"
        zIndex={5}
        justifyContent="center"
        alignItems="center"
        opacity={pauseVisible ? 1 : 0}
        transitionDuration="0.2s"
        >
        <Icon pos="absolute" w="70%" h="70%" as={
            !paused ? AiFillPauseCircle : AiFillPlayCircle}/>
    </Box>
  )
}

export default PauseComponent