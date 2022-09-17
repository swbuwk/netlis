import { Center } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import api from '../../axios'
import AlbumComponent from '../../components/AlbumComponent'
import { Album } from '../../models/Album'
import { AlbumService } from '../../services/AlbumService'

const AlbumPage = () => {
    const router = useRouter()
    const [album, setAlbum] = useState<Album | null>()

    const fetchAlbum = async () => {
        if (!router.query.id) return
        const data = await AlbumService.get(router.query.id)
        setAlbum(data)
    }

    useEffect(() => {
        fetchAlbum()
    }, [router.asPath])


  return (
    <Center h="100%" w="100%">
          <AlbumComponent fetchAlbum={fetchAlbum} album={album}/>
    </Center>
  )
}

export default AlbumPage