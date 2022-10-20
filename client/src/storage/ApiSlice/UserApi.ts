import { createApi } from '@reduxjs/toolkit/query/react'
import axiosBaseQuery from '.'
import { API_URL } from '../../axios'
import { Album } from '../../models/Album'
import { User } from '../../models/User'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery({ 
    baseUrl: API_URL+"/users",
}),

  endpoints: (build) => ({
    getMe: build.query<User, {}>({
        query: () => ({
            url: "/me",
            method: "GET"
        }),
    }),
    getUsers: build.query<User[], {}>({
        query: () => ({
            url: "",
            method: "GET"
        }),
    }),
    getOneUser: build.query<User, {}>({
        query: (user_id) => ({
            url: "",
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
            url: ``,
            method: "PATCH",
            data
        }),
    }),
    uploadUserPhoto: build.mutation<User, FormData>({
        query: (photo) => ({
            url: "/photo",
            method: "POST",
            data: photo,
        }),
    }),
    deleteUser: build.mutation<unknown, string>({
        query: (user_id) => ({
            url: "",
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