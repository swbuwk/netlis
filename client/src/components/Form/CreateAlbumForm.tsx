import { Box, Button, Flex, Heading, useToast, VStack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import imageCompression from 'browser-image-compression';
import { Form, Formik } from 'formik'
import React, { FC } from 'react'
import * as yup from 'yup';
import { useAppDispatch } from '../../hooks/redux';
import { ServerException } from '../../models/ServerException';
import { useCreateAlbumMutation } from '../../storage/ApiSlice/AlbumsApi';
import { useLazyGetMeQuery } from '../../storage/ApiSlice/UserApi';
import { setUser } from '../../storage/UserSlice/UserSlice';
import FileField, { FileFieldOptions } from './Field/FileField';
import InputField from './Field/InputField';
import SwitchField from './Field/SwitchField';
import TextAreaField from './Field/TextAreaField';

interface CreateAlbumFormProps {
  onClose: () => void
}

const CreateAlbumForm: FC<CreateAlbumFormProps> = ({onClose}) => {
  const dispatch = useAppDispatch()
  const toast = useToast()

  const [createAlbum] = useCreateAlbumMutation()
  const [getMe] = useLazyGetMeQuery()

  const toggleAlbumCreate = async (formData) => {
      await createAlbum(formData)
      .then(() => {
        toast({
          title: 'Album succesfully updated.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        })
      })
      .then(() => getMe({}))
      .then(res => dispatch(setUser(res.data)))
      .catch((err: AxiosError<ServerException>) => {
        toast({
          title: err.response.data.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        })
    })
    onClose()
  }

    const CreateAlbumSchema = yup.object().shape({
        name: yup.string()
            .min(2, 'Too Short')
            .max(50, 'Too Long')
            .required('Required'),
          description: yup.string()
            .max(100, "Too long"),
          private: yup.boolean(),
      });

  return (
    <Formik
    initialValues={{ 
      name: "",
      description: "",
      private: false,
      photo: {} as File
     }}
    validationSchema={CreateAlbumSchema}
    onSubmit={async (values, actions) => {
        if (values.photo.size > 5000000) {
            actions.setFieldError("photo", "Photo is too big (max 5MB).")
            return
        }
        const compresedPhoto = values.photo.size && (await imageCompression(values.photo, {
          maxSizeMB: 0.5
        }))
        const formData = new FormData()
        formData.append("name", values.name)
        formData.append("description", values.description)
        formData.append("private", ""+values.private)
        formData.append("photo", compresedPhoto)
        await toggleAlbumCreate(values)
    }
  }
  >
    {({}) => (
      <Flex w="100%" p="30px">
        <Form style={{width: "100%", display: "flex", flexDirection: "column"}}>
            <VStack spacing={"10px"} >
              <Flex w="100%" justifyContent="space-between">
                <Box w="50%" mr="30px">
                  <InputField fieldName='name'/>
                  <TextAreaField fieldName='description'/>
                  <SwitchField fieldName='private' name='Private'/>
                </Box>
                <FileField h="300px" w="50%" inputW={"15vw"} inputH={"15vw"}  option={FileFieldOptions.photo} fieldName='photo'/>
              </Flex>
            </VStack>
            <Flex justifyContent="flex-end" mt="10px">
                  <Button px="30px" type="submit">Create</Button>
                  <Button px="30px" ml="15px" onClick={onClose}>Cancel</Button>
            </Flex>
        </Form>
      </Flex>
      )}
  </Formik>
  )
}

export default CreateAlbumForm