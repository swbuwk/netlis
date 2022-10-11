import { Box, Button, Heading, VStack } from '@chakra-ui/react'
import {  Form, Formik } from 'formik'
import * as yup from 'yup';
import React from 'react'
import InputField from './Field/InputField';
import axios, { AxiosError } from 'axios';
import cookieCutter from 'cookie-cutter'
import { useAppDispatch } from '../../hooks/redux';
import { ServerException } from '../../models/ServerException';
import { useRouter } from 'next/router';
import { setUser, signIn } from '../../storage/UserSlice/UserSlice';
import { useLazyGetMeQuery } from '../../storage/ApiSlice/UserApi';


const SigninForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [getMe] = useLazyGetMeQuery()

  const login = async (req, setErrors) => {
    await axios.post("http://localhost:5000/auth/login", {...req})
    .then(res => {
      localStorage.setItem("access_token", res.data.access_token)
      cookieCutter.set("refresh_token", res.data.refresh_token)
      return getMe({})
    })
    .then(res => dispatch(signIn(res.data)))
    .then(() => router.push("/home"))
    .catch((err: AxiosError<ServerException>) => {
      setErrors({
        email: err.response.data.type === "email" ? err.response.data.message : "",
        password: err.response.data.type === "password" ? err.response.data.message : "",
      })
      return
    })
  }

  const SigninSchema = yup.object().shape({
    email: yup.string()
      .required('Required'),
    password: yup.string()
    .required('Required')
  });

    return (
        <Formik
          initialValues={{ 
            email: "",
            password: ""
           }}
          validationSchema={SigninSchema}
          onSubmit={async (values, actions) => {
            login(values, actions.setErrors)
          }
        }
        >
          {({}) => (
            <Box w={"45%"} m="30px">
                <Heading size={"2xl"} mb={5}>Sign in</Heading>
              <Form>
                  <VStack spacing={"10px"} >
                      <InputField fieldName='email'/>
                      <InputField fieldName='password' type={"password"}/>
                  </VStack>
                    <Button colorScheme={"orange"} type="submit" w="full" h="50px" mt="25px">
                      Sign in
                    </Button>
              </Form>
            </Box>
            )}
        </Formik>
      )
}

export default SigninForm