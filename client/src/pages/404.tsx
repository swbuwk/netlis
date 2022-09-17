import { Center, Heading } from '@chakra-ui/react'
import React from 'react'

const NotFound = () => {
  return (
    <Center h="100%" w="100%" flexDir="column">
      <Heading size="4xl">404</Heading>
      <Heading size="md">Page not found.</Heading>
    </Center>
  )
}

export default NotFound