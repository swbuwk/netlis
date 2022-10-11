import { Box, Button, Center, chakra, Container, Heading, Icon, keyframes, transition } from '@chakra-ui/react'
import { FaHeadphonesAlt } from '@react-icons/all-files/fa/FaHeadphonesAlt'
import { BiRightArrowAlt } from '@react-icons/all-files/bi/BiRightArrowAlt'
import { BiLeftArrowAlt } from '@react-icons/all-files/bi/BiLeftArrowAlt'
import React, { useState } from 'react'
import SigninForm from '../../components/Form/SigninForm'
import SignupForm from '../../components/Form/SignupForm'
import { ChakraBox } from '../_app'

const index = () => {
  const [animationKeyframes, setAnimationKeyframes] = useState("initial")

  const sliderVariants = {
    initial: {x: "100%", transition: { duration: 0 }},
    signin: {x: ["0%", "100%"]},
    signup: {x: ["100%", "0%"]}
  }

  const contentVariants = {
    initial: {x: 0, opacity: 1, transition: { duration: 0 }},
    signin:  {x: [-50, 0], opacity: [0, 1]},
    signup:  {x: [50, 0], opacity: [0, 1]}
  }

  const iconVariants = {
    initial: {backgroundColor: "#ffa300", transition: { duration: 0 }},
    signin: {backgroundColor: "#ffa300"},
    signup: {backgroundColor: "#fcc460"}
  }

  const toggleSlide = () => {
    setAnimationKeyframes(animationKeyframes === "signup" ? "signin" : "signup")
  }

  return (
    <Center pos="absolute" bgColor="gray.900" h="100vh" w="100vw" zIndex={50} flexDirection={"column"}>
      <Box
        display={"flex"}
        justifyContent="space-between"
        minW=""
        borderRadius={"20px"}
        bgColor={"#202838"}
        pos="relative">
          <ChakraBox 
            animate = {animationKeyframes}
            variants = {sliderVariants}
            // @ts-ignore
            transition={{ type: "spring", duration: 0.5 }}
            pos={"absolute"}
            zIndex={10}
            h="100%"
            w="50%"
            borderRadius={"20px"}
            bgColor={"#232e42"}
            overflow="hidden">
              <Center h="100%">
                <ChakraBox
                  variants={contentVariants}
                  animate={animationKeyframes}
                  // @ts-ignore
                  transition={{ type: "spring", duration: 0.5 }}
                  zIndex={1}
                  display="flex"
                  flexDir="column"
                  alignItems="center"
                  >
                  <Heading size={"lg"} mb={3}>{animationKeyframes === "signup" ? "Get started!" : "Signed up already?"}</Heading>
                  <Heading size={"sm"} mb={3}>or</Heading>
                  <Button
                    leftIcon={animationKeyframes === "signup" && <BiLeftArrowAlt/>}
                    rightIcon={animationKeyframes !== "signup" && <BiRightArrowAlt/>}
                    onClick={toggleSlide}
                    >{animationKeyframes === "signup" ? "Sign in" : "Sign up"}</Button>
                </ChakraBox>
                <ChakraBox
                  pos="absolute" zIndex={0}
                  variants={iconVariants}
                  animate={animationKeyframes}
                  h="100%"
                  >
                  <Icon as={FaHeadphonesAlt} w={400} h={400} color={"#ffa300"} transform={"rotateZ(-27deg)"}/>
                </ChakraBox>
              </Center>
            </ChakraBox>
        <SigninForm></SigninForm>
        <SignupForm></SignupForm>
      </Box>
    </Center>
  )
}

export default index