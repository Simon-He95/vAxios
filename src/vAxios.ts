import axios from 'axios'
import type { AxiosRequestConfig, AxiosInstance } from 'axios'
import type { VAxiosConfig } from './types'

export function vAxios(options: VAxiosConfig): AxiosInstance {
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

