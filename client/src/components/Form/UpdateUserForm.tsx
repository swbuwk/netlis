import { Box, Button, Flex, useToast, VStack } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { Form, Formik } from 'formik'
import React, { FC } from 'react'
import * as yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { ServerException } from '../../models/ServerException';
import { UserService } from '../../services/UserService';
import { updateUser } from '../../storage/Actions/updateUser';
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

  const update = async (body, photo) => {
    await UserService.updateAll(body, photo)
    .then(res => {
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
    dispatch(updateUser())

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
      photo: {} as Blob,
     }}
    validationSchema={UpdateUserSchema}
    onSubmit={async (values, actions) => {
      if (values.photo.size > 5000000) {
        actions.setFieldError("photo", "Photo is too big (max 5MB).")
        return
      }
      const {photo, ...body} = values
      await update(body, photo)
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
                  <Button px="30px" type="submit">Upload</Button>
                  <Button px="30px" ml="15px" onClick={onClose}>Cancel</Button>
            </Flex>
        </Form>
      </Flex>
      )}
  </Formik>
  )
}

export default UpdateUserForm