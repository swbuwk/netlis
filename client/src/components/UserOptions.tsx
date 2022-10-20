import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Modal, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { FaUser } from 'react-icons/fa'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { useDeleteUserMutation } from '../storage/ApiSlice/UserApi'
import { clearPlaylist } from '../storage/PlaylistSlice/PlaylistSlice'
import { signOut } from '../storage/UserSlice/UserSlice'
import ConfirmModal from './ConfirmModal'
import UpdateUserForm from './Form/UpdateUserForm'

const UserOptions: FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  const [deleteUser] = useDeleteUserMutation()

  const deleteCurrentUser = async () => {
    await router.push("/authorization")
    await deleteUser(user.info.id)
    dispatch(signOut())
    dispatch(clearPlaylist())
  } 

  const logout = async () => {
    await router.push("/authorization")
    dispatch(signOut())
    dispatch(clearPlaylist())
  }


  return (
    <Box 
        pos="absolute"
        top="10px"
        right="10px"
        >
          <Flex alignItems="center">
          <Avatar src={staticFile(user.info?.photo)} icon={<FaUser style={{transform: "translateY(5px)"}} size="2em"/>} bgColor="gray.300" pos="relative" left="-10px" zIndex={10}/>
            <Menu>
                <MenuButton
                    as={Button}
                    variant='outline'
                    zIndex={0}
                >{user.info.name}</MenuButton>
                <MenuList>
                  <MenuItem onClick={onOpen}>
                      Edit
                  </MenuItem>
                  <MenuItem onClick={logout}>
                      Logout
                  </MenuItem>
                  <MenuItem color={"red.400"} onClick={onDeleteOpen}>
                      Delete user
                  </MenuItem>
                </MenuList>
            </Menu>
          </Flex>

          <Modal isCentered isOpen={isOpen} onClose={onClose}>
              <ModalOverlay/>
              <ModalContent maxW="40%">
                  <ModalHeader>Update user info</ModalHeader>
                  <UpdateUserForm onClose={onClose}/>
              </ModalContent>
          </Modal>
          <ConfirmModal onConfirm={deleteCurrentUser} isOpen={isDeleteOpen} onClose={onDeleteClose}/>
    </Box>
  )
}

export default UserOptions