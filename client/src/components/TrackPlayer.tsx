import { Box, Flex, Heading, HStack, Icon, Progress, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react'
import React, { FC, useEffect, useRef, useState } from 'react'
import {AiFillPlayCircle, AiFillPauseCircle, AiFillStepBackward, AiFillStepForward} from "react-icons/ai"
import { BsFillVolumeMuteFill, BsFillVolumeUpFill, BsShuffle } from "react-icons/bs"
import { TbRepeat, TbRepeatOnce } from "react-icons/tb"
import { Variants } from 'framer-motion'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { autoNextTrack, lock, nextTrack, pause, play, prevTrack, RepeatingVariants, setDuration, togglePlay, toggleRepeating, toggleShuffle, unlock } from '../storage/PlaylistSlice/PlaylistSlice'
import { staticFile } from '../axios'
import { beautifyTime } from '../utils/beautifyTime'
import TrackPhoto from './TrackPhoto'
import { ChakraBox } from '../pages/_app'

const TrackPlayer:FC = () => {
    const audio = useRef<HTMLAudioElement>()
    const playlist = useAppSelector(state => state.playlist)
    const [time, setTime] = useState<number>(+localStorage.getItem("time"))
    const [volume, setVolume] = useState<number>(0.5)
    const [pauseVisible, setPauseVisible] = useState<boolean>(false)

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
          switch (e.key) {
            case "ArrowLeft": {
                changeTime(audio.current.currentTime - 5)
                break
            }
            case "ArrowRight": {
                changeTime(audio.current.currentTime + 5)
                break
            }
            case "ArrowUp": {
                setVolume(Math.min(1, audio.current.volume + 0.05))
                break
            }
            case "ArrowDown": {
                setVolume(Math.max(0, audio.current.volume - 0.05))
                break
            }
            // case " ": {
            //     dispatch(togglePlay())
            // }
          }
        }
    
        document.addEventListener('keydown', handleKeyDown)
        audio.current.currentTime = time
        if (playlist.currentTrack) dispatch(lock())
    
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, []);

    const dispatch = useAppDispatch()

    const playerVariants: Variants = {
        hidden: {
            y: "100%"
        },
        visible: {
            y: "0%"
        }
    }

    const changeTime = (time: number) => {
        setTime(time)
        localStorage.setItem("time", time.toString())
        audio.current.currentTime = time
    }

    useEffect(() => {
        if (playlist.isPlaying) audio.current.play()
        else audio.current.pause()
    }, [playlist.isPlaying])

    useEffect(() => {
        if (!playlist.currentTrack) {
            dispatch(pause())
            audio.current.src=""
            return
        }
        audio.current.src=staticFile(playlist.currentTrack.audio)
        dispatch(play())
        if (playlist.isPlaying) audio.current.play()
        dispatch(unlock())
    }, [playlist.currentTrack])

    useEffect(() => {
        audio.current.volume = volume
    }, [volume])

  return (
    <ChakraBox
        h="12vh" w="100%" 
        bottom="0%"
        bgColor="#212a3d"
        initial="hidden"
        animate={playlist.currentTrack ? "visible" : "hidden"}
        variants={playerVariants}
        p="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        zIndex={100}>
            <Flex w="full" justifyContent="center" alignItems="center" pos="relative">
                <Flex 
                    pos="absolute" left="10px" 
                    onMouseOver={() => setPauseVisible(true)}
                    onMouseOut={() => setPauseVisible(false)}
                >
                    <TrackPhoto 
                        track={playlist.currentTrack}
                        w="60px" h="60px"
                        paused={!playlist.isPlaying}
                        pauseVisible={pauseVisible}
                        onClick={() => dispatch(togglePlay())}
                        />
                    <Box>
                        <Heading size="md">
                            {playlist.currentTrack.name}
                        </Heading>
                        <Heading size="sm">
                            {playlist.currentTrack.uploader?.name}
                        </Heading>
                    </Box>
                </Flex>
                <Flex w="50%" flexDir="column" textAlign="center" alignItems="center">
                    <Flex justifyContent="center" alignItems="center" w="100%">
                        <Icon onClick={() => dispatch(toggleShuffle())} color={playlist.isShuffled ? "orange" : ""} as={BsShuffle}/>
                        <Icon onClick={() => dispatch(prevTrack())} w="30px" h="30px" ml="40px" as={AiFillStepBackward}/>
                        <Icon onClick={() => dispatch(togglePlay())} w="35px" h="35px" mx="40px" 
                            as={playlist.isPlaying ? AiFillPauseCircle : AiFillPlayCircle}/>
                        <Icon onClick={() => dispatch(nextTrack())} w="30px" h="30px" mr="40px" as={AiFillStepForward}/>
                        <Box onClick={() => dispatch(toggleRepeating())}>
                            {
                                playlist.repeating === RepeatingVariants.NONE &&
                                <Icon as={TbRepeat}/>
                            }
                            {
                                playlist.repeating === RepeatingVariants.FULL &&
                                <Icon as={TbRepeat} color="orange"/>
                            }
                            {
                                playlist.repeating === RepeatingVariants.ONE &&
                                <Icon as={TbRepeatOnce} color="orange"/>
                            }
                        </Box>
                    </Flex>
                    <HStack w="full" alignItems="center">
                        <Box>{beautifyTime(time)}</Box>
                        {
                            audio.current?.readyState > 0
                            ?
                            <Slider value={time} min={0} max={playlist.duration} step={0.1}
                                colorScheme='orange'
                                focusThumbOnChange={false}
                                onChange={e => changeTime(e)}
                                onChangeStart={() => audio.current.pause()}
                                onChangeEnd={() => playlist.isPlaying && audio.current.play() }>
                                <SliderTrack>
                                    <Progress pos="absolute" w={`${audio.current.buffered.length*100}%`} bgColor={"gray.600"}/>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb/>
                            </Slider>
                            :
                            <Progress w="100%" colorScheme="orange" h="3px" my="6px" isIndeterminate />
                        }
                        <Box>{beautifyTime(playlist.duration)}</Box>
                    </HStack>
                </Flex>
                <Flex pos="absolute" right="10px">
                    {
                        volume === 0
                        ?
                        <Icon as={BsFillVolumeMuteFill}/>
                        :
                        <Icon as={BsFillVolumeUpFill}/>
                    }
                    <Slider w="100px" ml="10px" value={volume} min={0} max={1} step={0.01}
                            colorScheme='orange'
                            focusThumbOnChange={false}
                            onChange={e => setVolume(e)}>
                            <SliderTrack>
                                <SliderFilledTrack />
                            </SliderTrack>
                            <SliderThumb/>
                            
                    </Slider>
                </Flex>
            </Flex>

            <audio ref={audio} src={staticFile(playlist.currentTrack.audio)}
                onCanPlay={() => {
                    dispatch(setDuration(audio.current.duration))
                }}
                onTimeUpdate={e => {
                    setTime(e.currentTarget.currentTime)
                    localStorage.setItem("time", time.toString())
                }}
                onEnded={() => {
                    dispatch(pause())
                    const prevTrackId = playlist.currentTrack.id
                    dispatch(autoNextTrack())
                    if (prevTrackId === playlist.currentTrack.id && (playlist.repeating === RepeatingVariants.ONE || playlist.tracks.length === 1)) {
                        audio.current.play()
                        dispatch(play())
                    }
                }}/>
    </ChakraBox>
  )
}

export default TrackPlayer