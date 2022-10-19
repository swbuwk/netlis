import { Box, FormControl, Heading, Input, Spinner, VStack } from '@chakra-ui/react'
import React, { useState, FC, useRef } from 'react'
import useDebounce from '../../hooks/useDebounce'
import { useSearchTracksQuery } from '../../storage/ApiSlice/TracksApi'
import TrackPreview from '../TrackPreview'

interface SearchTrackForAlbumFormProps {
  albumId: string
}

const SearchTrackForAlbumForm:FC<SearchTrackForAlbumFormProps>  = ({albumId}) => {
  const [search, setSearch] = useState<string>("")
  const debouncedSearch: string = useDebounce(search, 500)
  const audio = useRef<HTMLAudioElement>()
  const [time, setTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)

  const {data: tracks, isLoading, isFetching} = useSearchTracksQuery(debouncedSearch, {
    skip: !(search || search.length > 2) 
  })

  return (
    <Box h='50vh' p="20px" overflow="hidden">
      <Input
        placeholder="Search something here..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        mb="10px"
      />
      { debouncedSearch.length > 2 &&
      <Box h="85%" overflowX="hidden" overflowY="scroll"
      __css={{
        '&::-webkit-scrollbar': {
          width: '10px',
        },
        '&::-webkit-scrollbar-track': {
          width: '10px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: "orange",
          borderRadius: '8px',
        },
      }}>
        {
          isLoading || isFetching
          ?
          <Spinner/>
          :
          <VStack h="100%">
          {tracks?.length === 0 && <Heading color="gray.500" size="md">Cannot find any tracks :(</Heading>}
          {
            tracks?.map(track => (
              <TrackPreview 
                track={track} key={track.id}
                time={time}
                setTime={setTime}
                duration={duration}
                audio={audio.current}
                albumId={albumId}/>
            ))
          }
          </VStack>
        }
      </Box>
      }
      <audio ref={audio}
        onCanPlay={() => {
          setDuration(audio.current.duration)
        }}
        onTimeUpdate={e => {
            setTime(e.currentTarget.currentTime)
        }}
      />
    </Box>
  )
}

export default SearchTrackForAlbumForm