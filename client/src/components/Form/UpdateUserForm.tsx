import { Box, Button, Flex, useToast, VStack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Form, Formik } from 'formik'
import React, { FC } from 'react'
import * as yup from 'yup';
import imageCompression from 'browser-image-compression';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ServerException } from '../../models/ServerException';
import { useLazyGetMeQuery, useUpdateUserMutation, useUploadUserPhotoMutation } from '../../storage/ApiSlice/UserApi';
import { setUser } from '../../storage/UserSlice/UserSlice';
import FileField, { FileFieldOptions } from './Field/FileField';
import InputField from './Field/InputField';
import TextAreaField from './Field/TextAreaField';

interface UpdateUserFormProps {
  onClose: () => void
}

const UpdateUserForm: FC<UpdateUserFormProps> = ({onClose}) => {
  const user = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()
  const toast = useToast()
  const [getMe] = useLazyGetMeQuery()
  const [updateUser] = useUpdateUserMutation()
  const [uploadUserPhoto] = useUploadUserPhotoMutation()

  const update = async (body, photo) => {
    await updateUser(body)
    .then(() => uploadUserPhoto(photo))
    .then(() => {
      toast({
        title: 'User succesfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    })
    .catch((err: AxiosError<ServerException>) => {
      toast({
        title: err.response.data.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    })
    await getMe({}).then(res => dispatch(setUser(res.data)))

    onClose()
  }

  const UpdateUserSchema = yup.object().shape({
      name: yup.string()
          .min(2, 'Too Short')
          .max(50, 'Too Long')
          .required('Required'),
      address: yup.string()
        .max(100, "Too long"),
      bio: yup.string()
        .max(500, "Too long"),
    });

  return (
    <Formik
    initialValues={{ 
      name: "",
      bio: "",
      address: "",
      photo: {} as File,
     }}
    validationSchema={UpdateUserSchema}
    onSubmit={async (values, actions) => {
      if (values.photo.size > 5000000) {
        actions.setFieldError("photo", "Photo is too big (max 5MB).")
        return
      }
      const {photo, ...body} = values
      const compresedPhoto = values.photo.size && (await imageCompression(values.photo, {
        maxSizeMB: 0.5
      }))
      const formData = new FormData()
      if (compresedPhoto) formData.append("photo", compresedPhoto)
      await update(body, formData)
    }
  }
  >
    {({}) => (
      <Flex w="100%" p="30px">
        <Form style={{width: "100%", display: "flex", flexDirection: "column"}}>
            <VStack spacing={"10px"} >
              <Flex w="100%" justifyContent="space-between">
                <Box w="100%" mr="30px">
                  <InputField fieldName='name' defaultVal={user.info.name}/>
                  <InputField fieldName='address' defaultVal={user.info.address}/>
                </Box>
                <FileField option={FileFieldOptions.photo} defaultPhoto={user.info.photo} fieldName='photo'/>
              </Flex>
                <TextAreaField fieldName='bio' defaultVal={user.info.bio}/>
            </VStack>
            <Flex justifyContent="flex-end" mt="10px">
                  <Button px="30px" type="submit">Update</Button>
                  <Button px="30px" ml="15px" onClick={onClose}>Cancel</Button>
            </Flex>
        </Form>
      </Flex>
      )}
  </Formik>
  )
}

export default UpdateUserForm