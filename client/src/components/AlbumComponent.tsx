import { Box, Button, Center, Flex, Heading, HStack, Icon, Image, Modal, ModalContent, ModalHeader, ModalOverlay, Spinner, Text, useDisclosure, VStack } from '@chakra-ui/react'
import React, { FC } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { RiAlbumFill } from 'react-icons/ri'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { Album } from '../models/Album'
import { play, setCurrentTrack, setTracks, togglePlay } from '../storage/PlaylistSlice/PlaylistSlice'
import TrackComponent from './TrackComponent'
import UploadTrackForm from './Form/UploadTrackForm'
import { AddIcon, DeleteIcon, LockIcon } from '@chakra-ui/icons'
import { BiPauseCircle, BiPlayCircle } from 'react-icons/bi'
import { TbUpload } from 'react-icons/tb'
import ConfirmModal from './ConfirmModal'
import { useRouter } from 'next/router'
import { useDeleteAlbumMutation} from '../storage/ApiSlice/AlbumsApi'
import { useLazyGetMeQuery } from '../storage/ApiSlice/UserApi'
import { setUser } from '../storage/UserSlice/UserSlice'
import SearchTrackForAlbumForm from './Form/SearchTrackForAlbumForm'


interface AlbumComponentProps {
    album: Album
    fetchAlbum: () => Promise<void>
}

const AlbumComponent:FC<AlbumComponentProps> = ({album, fetchAlbum}) => {
    const user = useAppSelector(state => state.user)
    const playlist = useAppSelector(state => state.playlist)
    const router = useRouter()
    const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure()
    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure()
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const dispatch = useAppDispatch()
    
    const isPlaylistEqual = () => {
        return playlist.tracks.length === album.tracks.length && playlist.tracks.every(pl => album.tracks.find(al => al.id === pl.id)) 
    }
    
    const [getMe] = useLazyGetMeQuery()
    const [deleteAlbum] = useDeleteAlbumMutation()

    const toggleAlbumPlay = () => {
        if (!album.tracks.length) return
        if (!isPlaylistEqual()) dispatch(setCurrentTrack(album.tracks[0]))
        dispatch(setTracks(album.tracks))
        dispatch(togglePlay())
        document.title = `${album.name} is playing!`
    }
    
    const closeSearch = async () => {
        await fetchAlbum()
        onSearchClose()
    }

    const deleteCurrentAlbum = async () => {
        await deleteAlbum(album.id)
        await getMe({}).then(res => dispatch(setUser(res.data)))
        router.push("/home")
    }

  return (
    <Flex pos="relative" w="100%" h="100%" alignItems="center" flexDir="column">
        <Center bgColor="gray.900" w="100%" h="40%">
            <Flex justifyContent="flex-start"  w="90%" h="100%" alignItems="center">
                <Center h="120px" w="120px" mr="20px" boxShadow="dark-lg" bgColor="orange.400">
                    {
                        album.photo
                        ?
                        <Image w="100%" h="100%" src={staticFile(album.photo)}/>
                        :
                        user.info?.mainAlbum.id === album.id
                        ?
                        <Icon w="50%" h="50%" as={AiFillHeart}></Icon>
                        :
                        <Icon w="50%" h="50%" as={RiAlbumFill}></Icon>
                    }
                </Center>
                <Box>
                    <Heading size="2xl" mb="10px">{album.name} {album.private && <LockIcon w="20px" color="gray.700"/>}</Heading>
                    <Heading size="md" color="gray.600">{album.author.name}</Heading>
                </Box>          
            </Flex>
        </Center>
        <Flex alignItems="center" w="90%" h="12%" boxSizing="border-box">
            <Icon h="50px" w="50px" mr="20px" onClick={toggleAlbumPlay} as={isPlaylistEqual() && playlist.isPlaying ? BiPauseCircle : BiPlayCircle}/>
            {user.info?.mainAlbum.id !== album.id && 
            <>
                <Icon as={TbUpload} h="30px" w="30px" mr="20px" onClick={onUploadOpen}/>
                <AddIcon h="25px" w="25px" mr="20px" onClick={onSearchOpen}/>
                <DeleteIcon h="25px" w="25px" onClick={onDeleteOpen}/>
            </>
            }
        </Flex>
        <VStack spacing="5px" my="10px" w="95%" h="48%" overflowX="hidden" overflowY="scroll">
            {album.tracks.length === 0 && 
                <Flex flexDir="column" alignItems="center">
                    <Heading size="lg" color="gray.300" mb="10px">{"This album looks empty :("}</Heading>
                    {album.author.id === user.info.id && user.info?.mainAlbum.id !== album.id 
                        ?
                        <Center flexDir="column">
                            <Heading size="md" color="gray.400" mb="10px">Wanna fill it?</Heading>
                            <HStack spacing="10px">
                                <Button onClick={onUploadOpen}>Upload your track</Button>
                                <Text>or</Text>
                                <Button>Search for tracks</Button>
                            </HStack>
                        </Center>
                        :
                        <Center>
                            <Heading size="md" color="gray.400" mb="10px">You can fill this album by liking other tracks!</Heading>
                        </Center>
                    }
                </Flex>
            }
            {
                album.tracks.length > 0 && album.tracks.map(track => (
                <TrackComponent
                    w="100%" h="min"
                    key={track.id}
                    handlePlay={() => dispatch(setTracks(album.tracks))}
                    albumId={album.id} isMain={album.isMain}
                    track={track}/>
                ))
            }
        </VStack>
        <Modal isCentered isOpen={isUploadOpen} onClose={onUploadClose}>
            <ModalOverlay/>
            <ModalContent maxW="40%">
                <ModalHeader>Upload track</ModalHeader>
                <UploadTrackForm defaultAlbumOption={album.id} fetchAlbum={fetchAlbum} onClose={onUploadClose}/>
            </ModalContent>
        </Modal>
        <Modal isCentered isOpen={isSearchOpen} onClose={closeSearch}>
            <ModalOverlay/>
            <ModalContent maxW="40%">
                <ModalHeader>Search tracks for {album.name} album</ModalHeader>
                <SearchTrackForAlbumForm albumId={album.id}/>
            </ModalContent>
        </Modal>
        <ConfirmModal onConfirm={deleteCurrentAlbum} isOpen={isDeleteOpen} onClose={onDeleteClose}/>
    </Flex>
  )
}

export default AlbumComponent