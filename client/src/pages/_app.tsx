import { Box, ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { clearPlaylist, RepeatingVariants, setPlaylist} from '../storage/PlaylistSlice/PlaylistSlice'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { wrapper } from '../storage'
import { useEffect } from 'react'
import TrackPlayer from '../components/TrackPlayer'
import Navbar from '../components/Navbar'
import { setUser, signOut } from '../storage/UserSlice/UserSlice'
import { updateUser } from '../storage/Actions/updateUser'
import UserOptions from '../components/UserOptions'
import { SpinnerIcon } from '@chakra-ui/icons'
import { RouteGuard } from '../components/RouteGuard'

function MyApp({ Component, pageProps: {session, ...pageProps}, router }: AppProps) {
  const playlist = useAppSelector((state) => state.playlist)
  const user = useAppSelector((state) => state.user)

  const dispatch = useAppDispatch()

  const fetchData = async () => {
    try {
      await dispatch(updateUser())

      const tracks = JSON.parse(localStorage.getItem("tracks"))
      const options = JSON.parse(localStorage.getItem("options"))
      const currentTrack = JSON.parse(localStorage.getItem("current_track"))
      const time = JSON.parse(localStorage.getItem("audio_time"))
      const volume = JSON.parse(localStorage.getItem("volume"))
      const playlist = {
        currentTrack,
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
          <Box display="flex" flexDir="column" pos="relative" w="100vw" h="100vh">
            <Box display="flex" w="100%" h="90%">
              {user.signedIn && <Navbar/>}
              <RouteGuard>
                <Component {...pageProps}/>
              </RouteGuard>
            </Box>
            {
              playlist.currentTrack
              ?
              <TrackPlayer/>
              :
              <Box h="10%" w="100%" bgColor="#262f42"/>
            }
            </Box>
            {user.signedIn && <UserOptions/>}
        </ChakraProvider>
    </Box>
  )
}

export default wrapper.withRedux(MyApp)
