import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, {FC} from 'react'

interface ConfirmModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void
}

const ConfirmModal: FC<ConfirmModalProps> = ({isOpen, onClose, onConfirm}) => {
  return (
    <Modal size={"sm"} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Are you sure?</ModalHeader>
            <ModalBody my="20px" w="100%" display="flex" justifyContent="space-evenly">
                <Button w="30%" colorScheme={"green"} onClick={onConfirm}>Yes</Button>
                <Button w="30%" colorScheme={"red"} onClick={onClose}>No</Button>
            </ModalBody>
        </ModalContent>
    </Modal>
  )
}

export default ConfirmModal