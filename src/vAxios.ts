import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
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

type Get = <T = any, R = AxiosResponse<T>, D = any>(url: string, params: any, config?: AxiosRequestConfig<D>) => Promise<R>
export function vAxios(options: Merge<VAxiosConfig, AxiosRequestConfig>): Merge<AxiosInstance, {
  get: Get
  post: Get
  put: Get
  delete: Get
}> {
  const service = axios.create(options)
  const cancelMap = new Map<string, Canceler>()
  const CancelToken = axios.CancelToken
  const {
    request,
    response,
    requestError,
    responseError,
  } = options?.interceptors || {}
  service.interceptors.request.use((data) => {
    const key = generateKey(data);
    (data as any).cancel = cancelMap.get(key)
    return request?.(data) || data
  }, requestError)

  service.interceptors.response.use((data) => {
    cancelMap.delete(generateKey(data.config))
    return response?.(data) || data
  }, (error) => {
    if (error.config)
      cancelMap.delete(generateKey(error.config))
    return responseError?.(error) || Promise.reject(error)
  })

  const Get = service.get
  service.get = function (url: string, params?: Record<string, any>, config: AxiosRequestConfig<any> = {}) {
    const key = generateKey({ url, method: 'get', params })
    return Get.call(service, url, {
      cancelToken: new CancelToken(c => cancelInterceptor(key, c)),
      params,
      ...config,
    })
  } as typeof axios.get

  const Post = service.post
  service.post = function (url: string, data?: Record<string, any>, config: AxiosRequestConfig<any> = {}) {
    const key = generateKey({ url, method: 'post', data })
    return Post.call(service, url, data, {
      cancelToken: new CancelToken(c => cancelInterceptor(key, c)),
      ...config,
    })
  } as typeof axios.post

  const Put = service.put
  service.put = function (url: string, data?: Record<string, any>, config: AxiosRequestConfig<any> = {}) {
    const key = generateKey({ url, method: 'post', data })
    return Put.call(service, url, data, {
      cancelToken: new CancelToken(c => cancelInterceptor(key, c)),
      ...config,
    })
  } as typeof axios.put

  const Delete = service.delete
  service.delete = function (url: string, params?: Record<string, any>, config: AxiosRequestConfig<any> = {}) {
    const key = generateKey({ url, method: 'get', params })
    return Delete.call(service, url, {
      cancelToken: new CancelToken(c => cancelInterceptor(key, c)),
      params,
      ...config,
    })
  } as typeof axios.delete

  return service

  function cancelInterceptor(key: string, c: Canceler) {
    if (cancelMap.has(key))
      cancelMap.get(key)?.('取消上一个重复的请求')
    cancelMap.set(key, c)
  }
}

function generateKey(config: AxiosRequestConfig) {
  const { url, method, params, data } = config
  return `${url}-${method}-${JSON.stringify(method === 'get' ? params : data)}`
}

