import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '.'
import { API_URL } from '../../axios'
import { Album } from '../../models/Album'

export const albumsApi = createApi({
  reducerPath: 'albumsApi',
  baseQuery: axiosBaseQuery({ 
    baseUrl: API_URL+"/albums",
}),

  endpoints: (build) => ({
    getAlbums: build.query<Album[], {}>({
        query: () => ({
            url: "",
            method: "GET"
        }),
    }),
    getOneAlbum: build.query<Album, string>({
        query: (id) => ({
            url: `/${id}`,
            method: "GET"
        }),
    }),
    createAlbum: build.mutation<Album, FormData>({
        query: (data) => ({
            url: "",
            method: "POST",
            data,
        }),
        
    }),
    deleteAlbum: build.mutation<unknown, string>({
        query: (albumId) => ({
            url: "",
            method: "DELETE",
            params: {
                album_id: albumId
            }
        }),
    }),
    addTrackToAlbum: build.mutation<Album, {trackId: string, albumId: string}>({
        query: ({trackId, albumId}) => ({
            url: `/tracks?track_id=${trackId}&album_id=${albumId}`,
            method: "POST",
        }),
    }),
    removeTrackFromAlbum: build.mutation<unknown, {trackId: string, albumId: string}>({
        query: ({trackId, albumId}) => ({
            url: `/tracks?track_id=${trackId}&album_id=${albumId}`,
            method: "DELETE",
        }),
    }),
  }),
})


export const { 
    useLazyGetAlbumsQuery,
    useLazyGetOneAlbumQuery,
    useCreateAlbumMutation,
    useDeleteAlbumMutation,
    useAddTrackToAlbumMutation,
    useRemoveTrackFromAlbumMutation
} = albumsApi
