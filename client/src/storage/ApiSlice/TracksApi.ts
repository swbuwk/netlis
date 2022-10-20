import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '.'
import { API_URL } from '../../axios'
import { Comment, Track } from '../../models/Track'

export const tracksApi = createApi({
  reducerPath: 'tracksApi',
  baseQuery: axiosBaseQuery({ 
    baseUrl: API_URL+"/tracks",
}),
  endpoints: (build) => ({
    getTracks: build.query<Track[], {}>({
        query: () => ({
            url: "",
            method: "GET"
        }),
    }),
    getOneTrack: build.query<Track, string>({
        query: (id) => ({
            url: `/${id}`,
            method: "GET"
        }),
    }),
    searchTracks: build.query<Track[], string>({
        query: (search) => ({
            url: "",
            method: "GET",
            params: {
                s: search
            }
        }),
    }),
    uploadTrack: build.mutation<Track, FormData>({
        query: (data) => ({
            url: "/upload",
            method: "POST",
            data,
        }), 
    }),
    updateTrack: build.mutation<Track, {name: string, text: string, trackId: string}>({
        query: (data) => ({
            url: "",
            method: "PATCH",
            data,
            params: {
                track_id: data.trackId
            }
        }), 
    }),
    uploadTrackPhoto: build.mutation<Track, {photo: FormData, trackId: string}>({
        query: (data) => ({
            url: "/photo",
            method: "POST",
            data: data.photo,
            params: {
                track_id: data.trackId
            },
        }), 
    }),
    deleteTrack: build.mutation<unknown, string>({
        query: (track_id) => ({
            url: ``,
            method: "DELETE",
            params: {
                track_id
            }
        }),
    }),
    addComment: build.mutation<Comment, {trackId: string, text: string}>({
        query: ({trackId, text}) => ({
            url: "/comments",
            method: "POST",
            data: {text},
            params: {
                track_id: trackId
            }
        })
    }),
    getComments: build.query<Comment[], {trackId: string}>({
        query: ({trackId}) => ({
            url: "/comments",
            method: "GET",
            params: {
                track_id: trackId
            }
        })
    }),
    updateComment: build.mutation<Comment, {commentId: string, text: string}>({
        query: ({commentId, text}) => ({
            url: "/comments",
            method: "PATCH",
            data: {text},
            params: {
                comment_id: commentId
            }
        })
    }),
    deleteComment: build.mutation<Comment, {commentId: string}>({
        query: ({commentId}) => ({
            url: "/comments",
            method: "DELETE",
            params: {
                comment_id: commentId
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
    useLazyGetCommentsQuery,
    useUpdateCommentMutation,
    useDeleteCommentMutation
} = tracksApi
