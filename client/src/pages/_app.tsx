import { Box, chakra, ChakraProvider, Spinner } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { RepeatingVariants, setPlaylist} from '../storage/PlaylistSlice/PlaylistSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { wrapper } from '../storage'
import { useEffect } from 'react'
import TrackPlayer from '../components/TrackPlayer'
import Navbar from '../components/Navbar'
import { setUser, signIn, signOut } from '../storage/UserSlice/UserSlice'
import UserOptions from '../components/UserOptions'
import { RouteGuard } from '../components/RouteGuard'
import { isValidMotionProp, motion } from 'framer-motion'
import { useGetMeQuery, useLazyGetMeQuery } from '../storage/ApiSlice/UserApi'

export const ChakraBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || prop === 'children',
});

function MyApp({ Component, pageProps: {session, ...pageProps}, router }: AppProps) {
  const playlist = useAppSelector((state) => state.playlist)
  const user = useAppSelector((state) => state.user)
  const [getMe, {isLoading, isSuccess, isError}] = useLazyGetMeQuery()
  const dispatch = useAppDispatch()

  const fetchData = async () => {
    try {
      await getMe({})
      .then(res => {
        dispatch(signIn(res.data))
      })
      .catch(err => {
        dispatch(signOut())
        router.push("/")
      })

      const tracks = JSON.parse(localStorage.getItem("tracks"))
      const options = JSON.parse(localStorage.getItem("options"))
      const currentTrack = JSON.parse(localStorage.getItem("current_track"))
      const time = JSON.parse(localStorage.getItem("audio_time"))
      const volume = JSON.parse(localStorage.getItem("volume"))
      const playlist = {
        currentTrack,
        currentPreview: null,
        default: tracks,
        tracks,
        duration: 0,
        isShuffled: options?.shuffled || false,
        repeating: options?.repeating || RepeatingVariants.NONE,
        locked: false,
        time,
        isPlaying: false,
        volume
      }
      dispatch(setPlaylist(playlist))
    } catch(e) {
      console.log(e)
      dispatch(signOut())
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Box style={{
      height: "100vh",
      position: "relative",
      overflow: "hidden"
    }}>
        <ChakraProvider theme={theme}>
          <Box display="flex" flexDir="column" pos="relative" w="100vw" h="100vh"
          __css={{
            '*::-webkit-scrollbar': {
              width: '10px',
            },
            '*::-webkit-scrollbar-track': {
              width: '10px',
            },
            '*::-webkit-scrollbar-thumb': {
              backgroundColor: "orange",
              borderRadius: '8px',
            },
          }}>
            <Box display="flex" w="100%" h="88%" overflow="hidden">
              {user.signedIn && <Navbar/>}
              <RouteGuard>
                <Component {...pageProps}/>
              </RouteGuard>
            </Box>
            {
              playlist.currentTrack && user.signedIn
              ?
              <TrackPlayer/>
              :
              <Box h="12%" w="100%" bgColor="#262f42"/>
            }
          </Box>
          {user.signedIn && <UserOptions/>}
        </ChakraProvider>
    </Box>
  )
}

export default wrapper.withRedux(MyApp)
