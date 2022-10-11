import { Box, Button, FormControl, FormErrorMessage, FormLabel, Heading, VStack } from '@chakra-ui/react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as yup from 'yup';
import React from 'react'
import InputField from './Field/InputField';
import axios, { AxiosError } from 'axios';
import cookieCutter from 'cookie-cutter'
import { FaHeadphonesAlt } from '@react-icons/all-files/fa/FaHeadphonesAlt';
import { useAppDispatch } from '../../hooks/redux';
import { ServerException } from '../../models/ServerException';
import { useRouter } from 'next/router';
import { setUser, signIn } from '../../storage/UserSlice/UserSlice';
import { useLazyGetMeQuery } from '../../storage/ApiSlice/UserApi';

const SignupForm = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [getMe] = useLazyGetMeQuery()

  const registration = async (req, setErrors) => {
    await axios.post("http://localhost:5000/auth/registration", {...req, bio: "", address: ""})
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
      })
      return
    })
  }

  const SignupSchema = yup.object().shape({
    name: yup.string()
      .min(2, 'Too Short')
      .max(50, 'Too Long')
      .required('Required'),
    email: yup.string()
      .email('Invalid email')
      .required('Required'),
    password: yup.string()
    .min(8, 'Too Short')
    .max(32, 'Too Long')
    .required('Required')
    ,
  });

    return (
        <Formik
          initialValues={{ 
            name: "",
            email: "",
            password: ""
           }}
          validationSchema={SignupSchema}
          onSubmit={async (values, actions) => {
            registration(values, actions.setErrors)
          }
        }
        >
          {({}) => (
            <Box w={"45%"} m="30px">
                <Heading size={"2xl"} mb={5}>Sign up</Heading>
              <Form>
                  <VStack spacing={"10px"} >
                      <InputField fieldName='name'/>
                      <InputField fieldName='email'/>
                      <InputField fieldName='password' type={"password"}/>
                  </VStack>
                    <Button rightIcon={<FaHeadphonesAlt/>} colorScheme={"orange"} type="submit" w="full" h="50px" mt="30px">
                      Sign up
                    </Button>
              </Form>
            </Box>
            )}
        </Formik>
      )
}

export default SignupForm