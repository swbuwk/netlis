import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { wrapper } from '../storage'
import { useEffect } from 'react'
import { setUser, signOut } from '../storage/UserSlice/UserSlice'
import { updateUser } from '../storage/Actions/updateUser'

function MyApp({ Component, pageProps: {session, ...pageProps}, router }: AppProps) {
  const user = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch()

  const fetchData = async () => {
    try {
      dispatch(updateUser())

    } catch(e) {
      console.log(e)
      dispatch(signOut())
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (!user.loading && !user.signedIn && router.route != "/") {
      router.push("/authorization")
    }
  }, [user])

  return (
    <Box style={{
      height: "100vh",
      position: "relative",
      overflow: "hidden"
    }}>
      <ChakraProvider theme={theme}>
        <Box display="flex" flexDir="column" pos="relative" w="100vw" h="100vh">
          <Box display="flex" w="100%" h="90%">
            <Component {...pageProps}/>
      </ChakraProvider>
    </Box>
  )
}

export default wrapper.withRedux(MyApp)
