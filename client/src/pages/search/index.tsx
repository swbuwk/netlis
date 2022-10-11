import { Box, Button, Center, Flex, Heading, Input, Spinner, VStack } from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import api from '../../axios'
import TrackComponent from '../../components/TrackComponent'
import { useAppDispatch } from '../../hooks/redux'
import useDebounce from '../../hooks/useDebounce'
import { Track } from '../../models/Track'
import { useSearchTracksQuery } from '../../storage/ApiSlice/TracksApi'
import { setTracks } from '../../storage/PlaylistSlice/PlaylistSlice'

const Search = () => {
  const [search, setSearch] = useState<string>("")
  const dispatch = useAppDispatch()
  const debouncedSearch: string = useDebounce(search, 500)

  const {data: tracks, isLoading, isFetching} = useSearchTracksQuery(debouncedSearch, {
    skip: !(search || search.length > 2) 
  })

  return (
    <Flex alignItems="center" w="100%" h="100%" flexDir="column">
      <Input
        mt="100px"
        variant="flushed"
        fontSize="3xl"
        placeholder='Search for something cool...'
        w="70%"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {debouncedSearch.length > 2 && <Box w='90%'>
        <Heading my="20px">Tracks</Heading>
        
        {isLoading || isFetching
        ?
        <Center mt="30px" w="100%">
          <Spinner/>
        </Center>
        :
        <VStack w="100%">
          {
          tracks?.length > 0
          ?
          tracks.map(track => (
            <TrackComponent track={track} key={track.id} handlePlay={() => dispatch(setTracks(tracks))}/>
          ))
          :
          <Heading color="gray.500" size="lg">Cannot find any tracks :(</Heading>
          }
        </VStack>
        }
      </Box>}
      
    </Flex>
  )
}

export default Search