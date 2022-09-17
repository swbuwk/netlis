import { Box, Center } from '@chakra-ui/react'
import React, { Suspense, useEffect, useState } from 'react'
import api from '../../../axios'
import AlbumComponent from '../../../components/AlbumComponent'
import { useAppSelector } from '../../../hooks/redux'
import { Album } from '../../../models/Album'
import { AlbumService } from '../../../services/AlbumService'

const index = () => {
    const user = useAppSelector(state => state.user)
    const [album, setAlbum] = useState<Album | null>()

    const fetchAlbum = async () => {
        if (!user.info) return
        const data = await AlbumService.get(user.info.mainAlbum.id)
        setAlbum(data)
    }

    useEffect(() => {
        fetchAlbum()
    }, [user.info])


  return (
    <Center h="100%" w="100%">
          <AlbumComponent fetchAlbum={fetchAlbum} album={album}/>
    </Center>
  )
}

export default index