import { Box, BoxProps, Flex, Icon } from '@chakra-ui/react'
import React, { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { removeTrack } from '../storage/PlaylistSlice/PlaylistSlice'
import { Track } from '../models/Track'
import { beautifyTime } from '../utils/beautifyTime'
import TrackPhoto from './TrackPhoto'
import TrackOptions from './TrackOptions'
import { useRouter } from 'next/router'
import { BiHeart } from 'react-icons/bi'
import { AlbumService } from '../services/AlbumService'
import { BsHeartFill } from 'react-icons/bs'
import { FaHeart } from 'react-icons/fa'
import { updateUser } from '../storage/Actions/updateUser'

interface TrackComponentProps extends BoxProps {
    track: Track
    handlePlay?: () => void
    fromPlaylist?: boolean
    albumId?: string
}

const TrackComponent:FC<TrackComponentProps> = ({track, handlePlay, fromPlaylist = false, albumId = "", ...props}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const user = useAppSelector(state => state.user)

    const playlistTrackOptions = [
      {name:"Remove from playlist", fn: () => dispatch(removeTrack(track))},
      {name:"Go to original album", fn: () => router.push(`albums/${track.originalAlbumId}`)},
    ]

    const albumTrackOptions = [
      track.originalAlbumId === albumId ?
      {name: "Delete track", fn: () => {}} :
      {name: "Remove track from playlist", fn: () => {}},
    ]

    const isInMainAlbum = (trackId) => {
      return user.info?.mainAlbum.tracks.some(albumT => albumT.id === trackId)
    }

    const toggleTrackLike = async () => {
      if (!isInMainAlbum(track.id)) {
        await AlbumService.addTrack(track.id, user.info.mainAlbum.id)
      } else {
        await AlbumService.removeTrack(track.id, user.info.mainAlbum.id)
      }
      dispatch(updateUser())
    }

  return (
    <Box
        w="100%" 
        bgColor="#262f42"
        p="10px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        {...props}>
            <Flex alignItems="center">
              <TrackPhoto track={track} headphones handlePlay={handlePlay}/>
              <Icon w="35px" h="35px" as={FaHeart} ml="15px"
                transitionDuration="0.25s"
                color={isInMainAlbum(track.id) ? "orange" : ""}
                onClick={toggleTrackLike}
              />
            </Flex>
            <Box>
                {beautifyTime(track?.duration)}
                {fromPlaylist && <TrackOptions options={playlistTrackOptions}/>}
                {albumId && <TrackOptions options={albumTrackOptions}/>}
            </Box>
            
    </Box>
  )
}

export default TrackComponent