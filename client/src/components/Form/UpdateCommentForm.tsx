import { Button, Flex } from '@chakra-ui/react'
import {  Form, Formik } from 'formik'
import * as yup from 'yup';
import React, { FC } from 'react'
import TextAreaField from './Field/TextAreaField';
import { useAddCommentMutation, useUpdateCommentMutation } from '../../storage/ApiSlice/TracksApi';

interface UpdateCommentFormProps {
    commentId: string
    commentText: string
    onSubmit?: () => void
    setUpdateMode: (choince: boolean) => void
}

const UpdateCommentForm:FC<UpdateCommentFormProps> = ({onSubmit = () => {}, commentId, commentText, setUpdateMode}) => {
  const [updateComment] = useUpdateCommentMutation()

  const updateTrackComment = async (text) => {
    await updateComment({text, commentId})
    onSubmit()
  }

  const CommentSchema = yup.object().shape({
    text: yup.string()
      .required('Required')
      .max(200, "Comment is too big!"),
  });

    return (
        <Formik
          initialValues={{ 
            text: "",
           }}
          validationSchema={CommentSchema}
          onSubmit={async (values) => {
            await updateTrackComment(values.text)
            onSubmit()
            setUpdateMode(false)
          }
        }
        >
          {({}) => (
              <Form style={{width: "90%"}}>
                    <Flex flexDir="column" alignItems="flex-end" w="100%">
                        <TextAreaField label='Update comment' placeholder='Edit your comment here...' size={"sm"} fieldName='text' defaultVal={commentText}/>
                        <Flex alignItems="flex-end">
                            <Button colorScheme={"orange"} size="sm" type="submit" px="30px" mr="10px">
                                Send
                            </Button>
                            <Button size="sm" onClick={() => setUpdateMode(false)} px="20px">
                                Cancel
                            </Button>
                        </Flex>
                    </Flex>
              </Form>
            )}
        </Formik>
      )
}

export default UpdateCommentForm