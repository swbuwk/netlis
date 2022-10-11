import { Box, Center, Heading, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import api from '../../axios'
import AlbumComponent from '../../components/AlbumComponent'
import { Album } from '../../models/Album'
import { ServerException } from '../../models/ServerException'
import { useLazyGetOneAlbumQuery } from '../../storage/ApiSlice/AlbumsApi'

interface queryError{
  status?: number,
  data?: ServerException
}

const AlbumPage = () => {
    const router = useRouter()

    const [getOneAlbum, {data: album, isLoading, isError, isSuccess, ...result}] = useLazyGetOneAlbumQuery()
    const error = result.error as queryError

    const fetchAlbum = async () => {
        if (!router.query.id) return
        await getOneAlbum(router.query.id as string)
    }

    useEffect(() => {
        fetchAlbum()
    }, [router.asPath])

  return (
    <Center h="100%" w="100%">
      {isLoading && <Spinner/>}
      {isError && <Heading size="lg">{error.data.message}</Heading>}
      {isSuccess && <AlbumComponent fetchAlbum={fetchAlbum} album={album}/>}
    </Center>
  )
}

export default AlbumPage