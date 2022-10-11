import { BaseQueryFn } from "@reduxjs/toolkit/dist/query"
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios"
import api from "../../axios"
import { ServerException } from "../../models/ServerException"

export interface queryError{
  status?: number,
  data?: ServerException
}

const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: '' }
  ): BaseQueryFn<
    {
      url: string
      method: AxiosRequestConfig['method']
      data?: AxiosRequestConfig['data']
      params?: AxiosRequestConfig['params']
      headers?: AxiosRequestConfig['headers']
    },
    {
      data?: AxiosResponse
    },
    queryError
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await api({ url: baseUrl + url, method, data, params, headers })
      return { data: result.data }
    } catch (axiosError) {
      let err = axiosError as AxiosError<ServerException>
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      }
    }
  }


export default axiosBaseQuery