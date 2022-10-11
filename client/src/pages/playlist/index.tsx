import { Box, Center, Flex, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import TrackComponent from '../../components/TrackComponent'
import { useAppSelector } from '../../hooks/redux'

const index = () => {
  const playlist = useAppSelector(state => state.playlist)

  return (
    <Flex w="100%" h="100%" alignItems="center" justifyContent="center" flexDir="column">
        {playlist.tracks.length === 0
          ?
          <Heading size="md">There is no tracks in current playlist</Heading>
          :
          <Heading size="lg" mt="5%">Current playlist</Heading>
        }
        <VStack spacing="5px" my="40px" w="95%" overflowX="hidden" overflowY="scroll">
          {playlist.tracks.map(track => (
            <TrackComponent key={track.id} fromPlaylist track={track}/>
          ))}
        </VStack>
    </Flex>
  )
}

export default index