import { Box, Center, Heading, Spinner } from '@chakra-ui/react'
import React, { Suspense, useEffect, useState } from 'react'
import AlbumComponent from '../../../components/AlbumComponent'
import { useAppSelector } from '../../../hooks/redux'
import { queryError } from '../../../storage/ApiSlice'
import { useLazyGetOneAlbumQuery } from '../../../storage/ApiSlice/AlbumsApi'

const index = () => {
    const user = useAppSelector(state => state.user)
    const [getOneAlbum, {data: album, isLoading, isError, isSuccess, ...result}] = useLazyGetOneAlbumQuery()
    const error = result.error as queryError

    const fetchAlbum = async () => {
        if (!user.info) return
        await getOneAlbum(user.info.mainAlbum.id)
    }

    useEffect(() => {
        fetchAlbum()
    }, [user.info])


  return (
    <Center h="100%" w="100%">
        {isLoading && <Spinner/>}
        {isError && <Heading size="lg">{error.data.message}</Heading>}
        {isSuccess && <AlbumComponent fetchAlbum={fetchAlbum} album={album}/>}
    </Center>
  )
}

export default index