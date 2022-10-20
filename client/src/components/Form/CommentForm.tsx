import { Button, Flex } from '@chakra-ui/react'
import {  Form, Formik } from 'formik'
import * as yup from 'yup';
import React, { FC } from 'react'
import TextAreaField from './Field/TextAreaField';
import { useAddCommentMutation } from '../../storage/ApiSlice/TracksApi';


interface AddCommentFormProps {
    trackId: string
    onSubmit?: () => void
}

const AddCommentForm:FC<AddCommentFormProps> = ({onSubmit = () => {}, trackId}) => {
  const [addComment] = useAddCommentMutation()

  const addCommentToTrack = async (text) => {
    await addComment({text, trackId})
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
          onSubmit={async (values, actions) => {
            await addCommentToTrack(values.text)
            actions.setTouched({text: false})
            actions.setValues({text: ""})
          }
        }
        >
          {({}) => (
              <Form style={{width: "100%"}}>
                    <Flex flexDir="column" alignItems="center" w="100%">
                        <TextAreaField placeholder='Write your comment here...' fieldName='text'/>
                        <Button colorScheme={"orange"} type="submit" px="50px">
                        Send
                        </Button>
                    </Flex>
              </Form>
            )}
        </Formik>
      )
}

export default AddCommentForm