import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '.'
import { API_URL } from '../../axios'
import { Comment, Track } from '../../models/Track'

export const tracksApi = createApi({
  reducerPath: 'tracksApi',
  baseQuery: axiosBaseQuery({ 
    baseUrl: API_URL,
}),
  endpoints: (build) => ({
    getTracks: build.query<Track[], {}>({
        query: () => ({
            url: "/tracks",
            method: "GET"
        }),
    }),
    getOneTrack: build.query<Track, string>({
        query: (id) => ({
            url: `/tracks/${id}`,
            method: "GET"
        }),
    }),
    searchTracks: build.query<Track[], string>({
        query: (search) => ({
            url: `/tracks`,
            method: "GET",
            params: {
                s: search
            }
        }),
    }),
    uploadTrack: build.mutation<Track, FormData>({
        query: (data) => ({
            url: "/tracks/upload",
            method: "POST",
            data,
        }), 
    }),
    updateTrack: build.mutation<Track, {name: string, text: string, trackId: string}>({
        query: (data) => ({
            url: "/tracks/update",
            method: "POST",
            data,
            params: {
                track_id: data.trackId
            }
        }), 
    }),
    uploadTrackPhoto: build.mutation<Track, {photo: FormData, trackId: string}>({
        query: (data) => ({
            url: "/tracks/photo",
            method: "POST",
            data: data.photo,
            params: {
                track_id: data.trackId
            },
        }), 
    }),
    deleteTrack: build.mutation<unknown, string>({
        query: (track_id) => ({
            url: `/tracks`,
            method: "DELETE",
            params: {
                track_id
            }
        }),
    }),
    addComment: build.mutation<Comment, {trackId: string, text: string}>({
        query: ({trackId, text}) => ({
            url: "/tracks/comments",
            method: "POST",
            data: {text},
            params: {
                track_id: trackId
            }
        })
    }),
    getComments: build.query<Comment[], {trackId: string}>({
        query: ({trackId}) => ({
            url: "/tracks/comments",
            method: "GET",
            params: {
                track_id: trackId
            }
        })
    }),
  }),
})


export const { 
    useLazyGetTracksQuery,
    useLazyGetOneTrackQuery,
    useGetOneTrackQuery,
    useLazySearchTracksQuery,
    useSearchTracksQuery,
    useUploadTrackMutation,
    useUpdateTrackMutation,
    useUploadTrackPhotoMutation,
    useDeleteTrackMutation,
    useAddCommentMutation,
    useLazyGetCommentsQuery
} = tracksApi
