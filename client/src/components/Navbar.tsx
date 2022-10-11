import { Box, Button, Heading, Icon, Modal, ModalContent, ModalHeader, ModalOverlay, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { Variants } from 'framer-motion';
import React from 'react'
import { FaHeadphonesAlt } from '@react-icons/all-files/fa/FaHeadphonesAlt';
import { SearchIcon } from '@chakra-ui/icons';
import { FaHome } from 'react-icons/fa';
import { useRouter } from 'next/router';
import CreateAlbumForm from './Form/CreateAlbumForm';
import { useAppSelector } from '../hooks/redux';
import { ChakraBox } from '../pages/_app';

const Navbar = () => {
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const user = useAppSelector(state => state.user)

  const navBarVariants:Variants = {
    hidden: {
      x: "-100%"
    },
    visible: {
      x: "-0%"
    }
  }
  

  return (
    <ChakraBox
      initial="hidden"
      animate="visible"
      variants={navBarVariants}
      //@ts-ignore
      transition={{duration: 0.3}}
      h="100%" minW="15vw"
      top="0%"
      left="0%" 
      bgColor="#1e2533"
      display="flex"
      alignItems="flex-start"
      justifyContent="flex-start"
      flexDir="column"
      p="10px"
      zIndex={20}
      >
        <Box display="flex" color={"#ffa300"} w="100%" h="10%" mb="20px" justifyContent="center" alignItems="center" >
          <Icon boxSize="24px" as={FaHeadphonesAlt} mr="10px"/>
          <Heading size={"md"}>NETLIS</Heading>
        </Box>
        <Button onClick={() => router.push("/home")} leftIcon={<FaHome/>} w="100%" mb="10px">
          Home
        </Button>
        <Button onClick={() => router.push("/search")} leftIcon={<SearchIcon/>} w="100%" mb="50px">
          Search
        </Button>
        <Box w="100%">
          <Box borderY="1px solid gray" w="100%">
            <Text _hover={{bgColor: "gray.600"}} onClick={() => router.push("/albums/main")} transitionDuration="0.25s" p="10px" color="gray.400" size="md">{user.info.mainAlbum.name}</Text>
            {user.info && user.info.albums.map(album => (
              album.id !== user.info.mainAlbum.id && 
              <Text _hover={{bgColor: "gray.600"}} key={album.id} onClick={() => router.push(`/albums/${album.id}`)} transitionDuration="0.25s" p="10px" color="gray.400" size="md">{album.name}</Text>
            ))}
            <Text _hover={{bgColor: "gray.600"}} bgColor="gray.700" onClick={onOpen} transitionDuration="0.25s" p="10px" color="gray.400" size="md">
              Create album
            </Text>
          </Box>
          <Box borderBottom="1px solid gray" w="100%">
            <Text _hover={{bgColor: "gray.600"}} onClick={() => router.push("/playlist")} transitionDuration="0.25s" p="10px" color="gray.400" size="md">Current playlist</Text>
          </Box>
        </Box>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent maxW="40%">
                <ModalHeader>Create album</ModalHeader>
                <CreateAlbumForm onClose={onClose}/>
            </ModalContent>
        </Modal>
    </ChakraBox>
  )
}

export default Navbar