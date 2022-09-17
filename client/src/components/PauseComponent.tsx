import { chakra, Icon } from '@chakra-ui/react';
import { isValidMotionProp, motion } from 'framer-motion';
import React, { FC } from 'react'
import { AiFillPauseCircle, AiFillPlayCircle } from 'react-icons/ai';

interface PauseComponentProps {
    paused: boolean
}

const ChakraBox = chakra(motion.div, {
    shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
  });

const PauseComponent:FC<PauseComponentProps> = ({paused}) => {
  return (
    <ChakraBox
        pos="absolute"
        w="100%" h="100%"
        borderRadius="5px"
        bgColor={"rgba(0, 0, 0, 0.7)"}
        display="flex"
        zIndex={5}
        justifyContent="center"
        alignItems="center"
        initial={{opacity: 0}}
        whileHover={{opacity: 1}}
        //@ts-ignore
        transition={{duration: 0.2}}
        >
        <Icon pos="absolute" w="70%" h="70%" as={
            !paused ? AiFillPauseCircle : AiFillPlayCircle}/>
    </ChakraBox>
  )
}

export default PauseComponent