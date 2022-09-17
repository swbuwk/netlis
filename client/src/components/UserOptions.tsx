import { Avatar, Box, Button, Flex, Menu, MenuButton, MenuItem, MenuList, Modal, ModalContent, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { FC } from 'react'
import { staticFile } from '../axios'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { UserService } from '../services/UserService'
import { signOut } from '../storage/UserSlice/UserSlice'
import ConfirmModal from './ConfirmModal'
import UpdateUserForm from './Form/UpdateUserForm'

const UserOptions: FC = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(state => state.user)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()


  const deleteCurrentUser = async () => {
    await UserService.delete(user.info.id)
    dispatch(signOut())
  } 


  return (
    <Box 
        pos="absolute"
        top="10px"
        right="10px"
        >
          <Flex alignItems="center" >
          <Avatar src={staticFile(user.info?.photo)} pos="relative" left="-10px" zIndex={10}/>
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
                  <MenuItem onClick={() => dispatch(signOut())}>
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