import { Center, Flex, Heading, Spinner, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import api from '../../axios'
import TrackComponent from '../../components/TrackComponent';
import { useAppDispatch } from '../../hooks/redux';
import { Track } from '../../models/Track';
import { useLazyGetTracksQuery } from '../../storage/ApiSlice/TracksApi';
import { setTracks } from '../../storage/PlaylistSlice/PlaylistSlice';


const index = () => {
  const dispatch = useAppDispatch()

  const [getServerTracks, {data: serverTracks, isLoading , isSuccess}] = useLazyGetTracksQuery()

  useEffect(() => {
    getServerTracks({}).then(r => console.log(serverTracks))
  }, [])

  return <Flex h="100%" w="100%" flexDir="column" alignItems="center" >
    <Heading size="2xl" mt="10vh">Recent tracks</Heading>
    <Flex justifyContent="center" alignItems="center" my="40px" w="100%" h="60vh">
      {
        isLoading
        ?
        <Spinner/>
        :
        <VStack spacing={"5px"} my="20px" w="95%" h="100%" overflowX="hidden" overflowY="scroll">
          {
            serverTracks?.length
            ?
            serverTracks?.map(track => (
              <TrackComponent key={track.id} handlePlay={() => dispatch(setTracks(serverTracks))} track={track}/>
            ))
            :
            isSuccess && <Heading>Empty :(</Heading>
          }
        </VStack>
      }
      
    </Flex>
  </Flex>
}

export default index