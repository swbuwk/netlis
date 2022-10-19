import { Box, Center, ChakraProps, Flex, Heading, Icon, Image } from '@chakra-ui/react'
import React, { FC, ReactEventHandler } from 'react'
import { FaHeadphonesAlt, FaItunesNote } from 'react-icons/fa'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Track } from '../models/Track'
import { ChakraBox } from '../pages/_app'
import { setCurrentTrack, togglePlay } from '../storage/PlaylistSlice/PlaylistSlice'
import PauseComponent from './PauseComponent'

interface TrackPhotoProps extends ChakraProps {
    track: Track
    paused: boolean
    preview?: boolean
    headphones?: boolean
    pauseVisible: boolean,
    onClick?: () => void;
}

const TrackPhoto:FC<TrackPhotoProps> = ({track, headphones = false, paused, preview = false, pauseVisible, ...props}) => {
  const playlist = useAppSelector(state => state.playlist)

  return (
    <Flex>
      <Center 
        borderRadius="5px" pos="relative" w="45px" h="45px" mr="15px" bgColor={"#393e47"} {...props}>
        <PauseComponent 
          paused={paused} 
          pauseVisible={pauseVisible}
          />
        {(playlist.currentTrack?.id === track.id || preview && playlist.currentPreview?.id === track.id) && <Box 
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
    </Flex>
  )
}

export default TrackPhoto