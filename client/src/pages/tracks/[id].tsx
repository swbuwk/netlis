import { Box, Center, Flex, Heading, Icon, Image, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import { BsChevronCompactDown } from 'react-icons/bs'
import { FaHeart, FaItunesNote, FaPause, FaPlay } from 'react-icons/fa'
import { staticFile } from '../../axios'
import CommentComponent from '../../components/CommentComponent'
import CommentForm from '../../components/Form/CommentForm'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { useAddTrackToAlbumMutation, useRemoveTrackFromAlbumMutation } from '../../storage/ApiSlice/AlbumsApi'
import { useGetOneTrackQuery, useLazyGetCommentsQuery } from '../../storage/ApiSlice/TracksApi'
import { useLazyGetMeQuery } from '../../storage/ApiSlice/UserApi'
import { setCurrentTrack, togglePlay } from '../../storage/PlaylistSlice/PlaylistSlice'
import { setUser } from '../../storage/UserSlice/UserSlice'

const TrackPage = () => {
    const router = useRouter()
    const {data: track, isLoading, isError} = useGetOneTrackQuery("" + router.query.id)
    const user = useAppSelector(state => state.user)
    const playlist = useAppSelector(state => state.playlist)
    const dispatch = useAppDispatch()
    const [getMe] = useLazyGetMeQuery()
    const [addTrackToAlbum] = useAddTrackToAlbumMutation()
    const [removeTrackFromAlbum] = useRemoveTrackFromAlbumMutation()
    const [isChevronVisible, setIsChevronVisible] = useState<boolean>(true)
    const [getComments, {data: comments}] = useLazyGetCommentsQuery({})

    const isInMainAlbum = (trackId) => {
        return user.info.mainAlbum.tracks.some(albumT => albumT.id === trackId)
    }
    
    const [isLiked, setIsLiked] = useState<boolean>(isInMainAlbum(track?.id))

    const page = useCallback((node: HTMLDivElement) => {
        const updateOnScroll = () => {
            if (node.scrollTop > 10) setIsChevronVisible(false)
            else setIsChevronVisible(true)
        }
        if (node) {
            node.addEventListener("scroll", updateOnScroll)
        }
    }, [])

    useEffect(() => {
        if (track) refetchComments()
    }, [track])

    const refetchComments = async () => {
        await getComments({trackId: track.id})
    }

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

    if (isLoading) return (
        <Center w="100%">
            <Spinner/>
        </Center>
    )

    if (isError) return (
        <Center w="100%" textAlign="center">
            <Heading>Cannot find this track</Heading>
        </Center>
    )

  return (
    <Flex ref={page} __css={{
        '&::-webkit-scrollbar': {
          width: '0',
        }}}
        display="flex" w="100%" h="100%" flexDir="column" alignItems="center" overflowY="scroll"
        >
        <Center w="100%" minH="100%" pos="relative" flexDir="column">
            <Center bgColor="gray.700" boxShadow="dark-lg" h="15vw" w="15vw" pos="relative">
                <Center pos="absolute" h="100%" w="100%" 
                    bg="rgba(0, 0, 0, 0.7)"
                    transitionDuration="0.25s"
                    opacity={0} _hover={{opacity: 1}}>
                    <Icon w="50%" h="50%" as={FaHeart} 
                        onClick={toggleTrackLike}
                        color={isLiked ? "orange" : "white"}
                        transitionDuration="0.25s"
                        />
                </Center>
                {
                    track.photo
                    ?
                    <Image h="100%" w="100%" src={staticFile(track.photo)}/>
                    :
                    <Icon w="50%" h="50%" as={FaItunesNote}/>
                }
            </Center>
            <Heading mt="10px" size="2xl">{track.name}</Heading>
            <Heading mt="8px" color="gray.400" size="lg">{track.uploader.name}</Heading>
            <Center borderRadius="20px" bgColor="orange.400" p="10px" w="200px" mt="20px"
                onClick={() => {
                    if (playlist.currentTrack?.id === track.id) dispatch(togglePlay())
                    else dispatch(setCurrentTrack(track))
                }}
            >
                {
                    playlist.isPlaying && playlist.currentTrack.id === track?.id
                    ?
                    <Icon h="30px" w="30px" as={FaPause}/>
                    :
                    <Icon h="30px" w="30px" as={FaPlay}/>
                }
            </Center>
            <Icon
                pos="absolute"
                bottom="20px"
                h="40px" w="40px"
                transitionDuration="0.1s"
                opacity={+isChevronVisible}
                as={BsChevronCompactDown}/>
        </Center>
        <Flex w="80%" pb="30px" flexDir="column" alignItems="center" mt="30px">
            <Heading w="100%" mb="20px">Comments</Heading>
            <CommentForm trackId={track.id} onSubmit={refetchComments}/>
            <Box my="30px" w="90%" h="1px" bgColor="gray.600"/>
            {        
                comments && comments.map(comment => (
                    <CommentComponent key={comment.id} comment={comment} refetchComments={refetchComments}/>
                ))
            }
        </Flex>
    </Flex>
  )
}

export default TrackPage