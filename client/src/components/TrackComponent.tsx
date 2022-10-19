import { Box, BoxProps, Flex, Heading, Icon } from '@chakra-ui/react'
import React, { FC, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { removeTrack, setCurrentTrack, togglePlay } from '../storage/PlaylistSlice/PlaylistSlice'
import { Track } from '../models/Track'
import { beautifyTime } from '../utils/beautifyTime'
import TrackPhoto from './TrackPhoto'
import TrackOptions from './TrackOptions'
import { useRouter } from 'next/router'
import { FaHeart } from 'react-icons/fa'
import { useAddTrackToAlbumMutation, useRemoveTrackFromAlbumMutation } from '../storage/ApiSlice/AlbumsApi'
import { useLazyGetMeQuery } from '../storage/ApiSlice/UserApi'
import { setUser } from '../storage/UserSlice/UserSlice'

interface TrackComponentProps extends BoxProps {
    track: Track
    handlePlay?: () => void
    fromPlaylist?: boolean
    albumId?: string
    isMain?: boolean
}

const TrackComponent:FC<TrackComponentProps> = ({track, handlePlay, fromPlaylist = false, albumId = "", isMain = false, ...props}) => {
    const [pauseVisible, setPauseVisible] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const router = useRouter()
    const user = useAppSelector(state => state.user)
    const playlist = useAppSelector(state => state.playlist)
    const [addTrackToAlbum] = useAddTrackToAlbumMutation()
    const [removeTrackFromAlbum] = useRemoveTrackFromAlbumMutation()
    const [getMe] = useLazyGetMeQuery()

    const isInMainAlbum = (trackId) => {
      return user.info.mainAlbum.tracks.some(albumT => albumT.id === trackId)
    }

    const [isLiked, setIsLiked] = useState<boolean>(isInMainAlbum(track.id))

    const playlistTrackOptions = [
      {name:"Remove from playlist", fn: () => dispatch(removeTrack(track))},
      {name:"Go to original album", fn: () => router.push(`albums/${track.originalAlbumId}`)},
    ]

    const albumTrackOptions = !isMain ? [
      track.originalAlbumId === albumId ?
      {name: "Delete track", fn: () => {}} :
      {name: "Remove track from album", fn: () => {}},
    ] : []


    const toggleTrackLike = async () => {
      if (!isLiked) {
        await addTrackToAlbum({
          trackId: track.id, 
          albumId: user.info.mainAlbum.id
        })
      } else {
        await removeTrackFromAlbum({
          trackId: track.id, 
          albumId: user.info.mainAlbum.id
        })
      }
      await getMe({}).then(res => dispatch(setUser(res.data)))
      setIsLiked(prev => !prev)
    }

  return (
    <Box
        w="100%" 
        bgColor="#262f42"
        p="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        zIndex={0}
        pos="relative"
        {...props}>
          <Box h="100%" w="100%" pos="absolute" zIndex={0}
            onMouseOver={() => setPauseVisible(true)}
            onMouseOut={() => setPauseVisible(false)}
            onClick={() => {
              if (handlePlay) handlePlay()
              if (playlist.currentTrack?.id === track.id) dispatch(togglePlay())
              else dispatch(setCurrentTrack(track))
            }}
          >
          </Box>
          <Flex alignItems="center">
            <TrackPhoto zIndex={-1} 
              track={track} headphones 
              paused={!playlist.isPlaying || (playlist.currentTrack.id !== track.id)}
              pauseVisible={pauseVisible}/>
            <Box zIndex={1}>
              <Heading as="a" size="sm" cursor="pointer" onClick={() => router.push(`/tracks/${track.id}`)}>
                  {track.name}
              </Heading>
              <Heading size="xs">
                  {track.uploader?.name}
              </Heading>
            </Box>
            <Icon w="25px" h="25px" as={FaHeart} zIndex={1} ml="25px"
              transitionDuration="0.25s"
              color={isLiked ? "orange" : ""}
              onClick={toggleTrackLike}
              _hover={{transform: "scale(1.1)"}}
            />
          </Flex>
          <Flex alignItems="center">
              <Box>
                {beautifyTime(track?.duration)}
              </Box>
              <Box ml="10px">
                {albumId && <TrackOptions options={albumTrackOptions}/>}
                {fromPlaylist && <TrackOptions options={playlistTrackOptions}/>}
              </Box>
          </Flex>
    </Box>
  )
}

export default TrackComponent