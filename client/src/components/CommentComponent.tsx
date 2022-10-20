import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, Flex, Heading, Icon, Image, Text, Textarea } from '@chakra-ui/react'
import React, {FC, useState} from 'react'
import { FaUser } from 'react-icons/fa'
import { staticFile } from '../axios'
import { useAppSelector } from '../hooks/redux'
import { Comment } from '../models/Track'
import { useDeleteCommentMutation, useLazyGetCommentsQuery } from '../storage/ApiSlice/TracksApi'
import UpdateCommentForm from './Form/UpdateCommentForm'

interface CommentComponentProps {
    comment: Comment,
    refetchComments: () => Promise<void>
}

const CommentComponent: FC<CommentComponentProps> = ({comment, refetchComments}) => {
    const [updateMode, setUpdateMode] = useState<boolean>(false)
    const user = useAppSelector(state => state.user)
    const [deleteComment] = useDeleteCommentMutation()

    const handleCommentDelete = async (commentId: string) => {
        await deleteComment({commentId})
        await refetchComments()
    }

  return (
    <Flex w="100%" bgColor="gray.700" p="15px" my="5px" borderRadius="5px" justifyContent="space-between">
        <Flex w="100%">
            {
                comment.author.photo
                ?
                <Image src={staticFile(comment.author.photo)} minW="50px" w="50px" h="50px"/>
                :
                <Box bgColor="gray.300" w="50px" h="50px">
                    <Icon as={FaUser} h="100%" w="100%" style={{transform: "translateY(5px)"}} color="gray.700"/>
                </Box>
            }
                {
                    !updateMode
                    ?
                    <Box mx="10px">
                        <Heading size="md">{comment.author.name}</Heading>
                        <Text wordBreak="break-all">{comment.text}</Text>
                    </Box>
                    :
                    <Flex w="100%" justifyContent="center">
                        <UpdateCommentForm commentId={""+comment.id} commentText={comment.text} setUpdateMode={setUpdateMode} onSubmit={refetchComments}/>
                    </Flex>
                }
        </Flex>
        {
            comment.author.id === user.info.id && !updateMode && <Flex h="100%">
                <EditIcon h="20px" w="20px" onClick={() => setUpdateMode(true)}/>
                <DeleteIcon h="20px" w="20px" ml="10px" onClick={() => handleCommentDelete(""+comment.id)}/>
            </Flex>
        }
    </Flex>
  )
}

export default CommentComponent