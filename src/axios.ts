import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosStatic
} from 'axios'

export default function axiosFactory (axios: AxiosStatic, options: AxiosRequestConfig): AxiosInstance {
  return axios.create(options)
}