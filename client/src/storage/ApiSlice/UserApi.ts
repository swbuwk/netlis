import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '.'
import { API_URL } from '../../axios'
import { Album } from '../../models/Album'
import { User } from '../../models/User'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({ 
    baseUrl: API_URL,
}),

  endpoints: (build) => ({
    getMe: build.query<User, {}>({
        query: () => ({
            url: "/users/me",
            method: "GET"
        }),
    }),
    getUsers: build.query<User[], {}>({
        query: () => ({
            url: "/users",
            method: "GET"
        }),
    }),
    getOneUser: build.query<User, {}>({
        query: (user_id) => ({
            url: "/users",
            method: "GET",
            params: {
                user_id
            }
        }),
    }),
    updateUser: build.mutation<User, {
        name: string,
        bio: string,
        address: string
    }>({
        query: (data) => ({
            url: `/users/update`,
            method: "POST",
            data
        }),
    }),
    uploadUserPhoto: build.mutation<User, FormData>({
        query: (photo) => ({
            url: "/users/photo",
            method: "POST",
            data: photo,
        }),
    }),
    deleteUser: build.mutation<unknown, string>({
        query: (user_id) => ({
            url: "/usets",
            method: "DELETE",
            params: {
                user_id
            }
        }),
        
    }),
  }),
})

export const {
    useGetMeQuery,
    useLazyGetMeQuery,
    useLazyGetUsersQuery,
    useLazyGetOneUserQuery,
    useUpdateUserMutation,
    useUploadUserPhotoMutation,
    useDeleteUserMutation,
} = userApi