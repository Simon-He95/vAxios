import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export type Merge<A, B> = {
  [K in keyof (A & B)]: K extends keyof B
    ? B[K]
    : K extends keyof A
      ? A[K]
      : never
}

export interface VAxiosConfig {
  interceptors?: Interceptors
  retry?: number
}

export interface Interceptors {
  request?: (data: any) => any
  requestError?: (error: any) => Promise<any>
  response?: (data: any) => any
  responseError?: (error: any) => Promise<any>
}

export type Get = <T = any, R = AxiosResponse<T>, D = any>(url: string, params: any, config?: AxiosRequestConfig<D>) => Promise<R>
