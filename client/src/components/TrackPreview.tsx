import { AddIcon, CheckIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react'
import React, {FC, useState, useRef, useEffect, SyntheticEvent} from 'react'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Track } from '../models/Track'
import { useAddTrackToAlbumMutation } from '../storage/ApiSlice/AlbumsApi'
import { togglePlay, setCurrentTrack, pause, setCurrentPreview } from '../storage/PlaylistSlice/PlaylistSlice'
import { beautifyTime } from '../utils/beautifyTime'
import TrackOptions from './TrackOptions'
import TrackPhoto from './TrackPhoto'

interface TrackPreviewProps {
    track: Track,
    albumId: string
    audio: HTMLAudioElement,
    time: number,
    setTime: (time: number) => void
    duration: number
}

const TrackPreview:FC<TrackPreviewProps> = ({track, albumId, audio, time, setTime, duration, ...props}) => {
    const {currentPreview} = useAppSelector(state => state.playlist)
    const [addTrackToAlbum] = useAddTrackToAlbumMutation()
    const [isAdded, setIsAdded] = useState<boolean>(false)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)
    const dispatch = useAppDispatch()

    const changeTime = (time: number) => {
        setTime(time)
        audio.currentTime = time
    }

    const changePreview = () => {
        audio.pause()
        audio.src = staticFile(track.audio)
        dispatch(setCurrentPreview(track))
        setIsPlaying(true)
        audio.play()
    }

    useEffect(() => {
        if (isPlaying) audio.play()
        else audio.pause()
    }, [isPlaying])


  return (
    <Flex
        w="100%" 
        bgColor="#262f42"
        p="10px"
        alignItems="center"
        justifyContent="space-between"
        flexDir="column"
        zIndex={0}
        pos="relative"
        {...props}>
          <Box h="100%" w="100%" pos="absolute" zIndex={0}
            onClick={() => {
                dispatch(pause())
                if (track.id !== currentPreview?.id) changePreview()
                else setIsPlaying(prev => !prev)
            }}
          >
          </Box>
            <Flex w="100%" mb="10px" alignItems="center" justifyContent="space-between">
                <Flex>
                    <TrackPhoto zIndex={-1} 
                        track={track} preview headphones 
                        paused={!isPlaying || (currentPreview?.id !== track.id)}
                        pauseVisible/>
                    <Box zIndex={1}>
                        <Heading size="sm">
                            {track.name}
                        </Heading>
                        <Heading size="xs">
                            {track.uploader?.name}
                        </Heading>
                    </Box>
                </Flex>
                {
                    isAdded
                    ?
                    <CheckIcon w="25px" h="25px"/>
                    :
                    <AddIcon w="25px" h="25px" zIndex={1} ml="25px"
                        onClick={async () => {
                            await addTrackToAlbum({
                                albumId,
                                trackId: track.id
                            })
                            setIsAdded(true)
                        }}
                    />
                }
            </Flex>
            <Flex w="100%" alignItems="center">
                {
                    audio?.readyState > 0 && currentPreview.id === track.id
                    ?
                    <Slider mx="10px" value={time} min={0} max={duration} step={0.1}
                        colorScheme='orange'
                        focusThumbOnChange={false}
                        onChange={e => changeTime(e)}
                        onChangeStart={() => audio.pause()}
                        onChangeEnd={() => isPlaying && audio.play() }>
                        <SliderTrack>
                            <Progress pos="absolute" w={`${audio.buffered.length*100}%`} bgColor={"gray.600"}/>
                            <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb/>
                    </Slider>
                    :
                    <Progress w="100%" mx="10px" colorScheme="orange" h="3px" my="6px" />
                }
                <Box >
                    {beautifyTime(track?.duration)}
                </Box>
            </Flex>

            
    </Flex>
  )
}

export default TrackPreview