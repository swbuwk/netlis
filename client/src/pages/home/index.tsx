import { Box, Center, Flex, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import api from '../../axios'
import TrackComponent from '../../components/TrackComponent';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Track } from '../../models/Track';
import { pause, setTracks } from '../../storage/PlaylistSlice/PlaylistSlice';


const index = () => {
  const [serverTracks, setServerTracks] = useState<Track[] | null>()
  const user = useAppSelector(state => state.user)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (user.info === undefined) return
    if (user.info === null && !user.signedIn) router.push("/authorization")
    api.get<Track[]>("tracks").then((res) => {
      setServerTracks(res.data)
    });
  }, [user])

  return <Flex h="100%" w="100%" flexDir="column" alignItems="center" >
    <Heading size="2xl" mt="5%">Recent tracks</Heading>
    <Center my="40px" w="100%">
      <VStack spacing={"5px"} my="20px" w="95%" overflowY="scroll">
        {
        serverTracks?.length
        ?
        serverTracks?.map(track => (
          <TrackComponent key={track.id} handlePlay={() => dispatch(setTracks(serverTracks))} track={track}/>
        ))
        :
        <Heading>Empty :(</Heading>
      }
      </VStack>
    </Center>
  </Flex>
}

export default index