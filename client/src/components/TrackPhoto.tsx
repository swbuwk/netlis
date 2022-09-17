import { Box, Center, chakra, ChakraProps, Flex, Heading, Icon, Image } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import React, { FC } from 'react'
import { FaHeadphonesAlt, FaItunesNote } from 'react-icons/fa'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Track } from '../models/Track'
import { setCurrentTrack, togglePlay } from '../storage/PlaylistSlice/PlaylistSlice'
import PauseComponent from './PauseComponent'

const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

interface TrackPhotoProps extends ChakraProps {
    track: Track
    handlePlay?: () => void
    headphones?: boolean
    titleSize?: string
    authorSize?: string
}

const TrackPhoto:FC<TrackPhotoProps> = ({track, handlePlay, headphones = false, titleSize = "sm", authorSize = "xs", ...props}) => {
  const playlist = useAppSelector(state => state.playlist)
  const dispatch = useAppDispatch()

  return (
    <Flex>
      
      <Center onClick={() => {
        if (handlePlay) handlePlay()
        if (playlist.currentTrack?.id === track.id) dispatch(togglePlay())
        else dispatch(setCurrentTrack(track))
        }}
        borderRadius="5px" pos="relative" w="45px" h="45px" mr="15px" bgColor={"#393e47"} {...props}>
        <PauseComponent paused={!playlist.isPlaying || playlist.currentTrack.id !== track.id}/>
        {playlist.currentTrack?.id === track.id && <Box 
            pos="absolute"
            w="100%" h="100%"
            borderRadius="5px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgColor={headphones ? "rgba(0, 0, 0, 0.7)" : ""}>
                {
                  headphones && 
                  <ChakraBox  
                    w="60%" h="60%"
                    animate={playlist.isPlaying ? {
                        scale: [1, 1.1, 1],
                    }:{
                        scale: [1, 1]
                    }}
                    //@ts-ignore
                    transition={{duration: 0.5, repeat: Infinity}}
                  >
                    <Icon
                        as={FaHeadphonesAlt}
                        w="100%" h="100%" color={"#ffa300"}/>                               
                  </ChakraBox>
                }
        </Box>}
        {
            track?.photo
            ?
            <Image borderRadius="5px" w="100%" h="100%" src={staticFile(track.photo)}/>
            :
            <Icon w="50%" h="50%" as={FaItunesNote}/>
        }
      </Center>
      <Box>
        <Heading size={titleSize}>
            {track.name}
        </Heading>
        <Heading size={authorSize}>
            {track.uploader?.name}
        </Heading>
      </Box>
    </Flex>
  )
}

export default TrackPhoto