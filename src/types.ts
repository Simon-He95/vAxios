import type { AxiosRequestConfig } from 'axios'
export interface VAxiosConfig extends AxiosRequestConfig {
  interceptors: Interceptors
}

interface Interceptors {
  request: (data: any) => any
  requestError: (error: any) => Promise<any>
  response: (data: any) => any
  responseError: (error: any) => Promise<any>
}
