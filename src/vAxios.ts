import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Merge } from './types'
export interface VAxiosConfig {
  interceptors?: Interceptors
}

interface Interceptors {
  request?: (data: any) => any
  requestError?: (error: any) => Promise<any>
  response?: (data: any) => any
  responseError?: (error: any) => Promise<any>
}

export function vAxios(options: Merge<VAxiosConfig, AxiosRequestConfig>): AxiosInstance {
  const service = axios.create(options)
  const {
    request,
    response,
    requestError,
    responseError,
  } = options?.interceptors || {}
  if (request)
    service.interceptors.request.use(request, requestError)

  if (response)
    service.interceptors.response.use(response, responseError)

  const Get = service.get
  service.get = function (url: string, params?: Record<string, any>, config?: AxiosRequestConfig<any>) {
    return Get.call(service, url, {
      params,
      ...config,
    })
  } as typeof axios.get
  return service
}

