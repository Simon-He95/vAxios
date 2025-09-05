import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { Get, Merge, VAxiosConfig } from './types'
import axios from 'axios'
import { stableStringify } from '../utils'

export function vAxios(options?: Merge<VAxiosConfig, AxiosRequestConfig>): Merge<AxiosInstance, {
  get: Get
  post: Get
  put: Get
  delete: Get
}> {
  const service = axios.create(options)
  const cancelMap = new Map<string, AbortController>()
  const {
    request,
    response,
    requestError,
    responseError,
  } = options?.interceptors || {}
  service.interceptors.request.use((data) => {
    const key = generateKey(data)
    const controller = cancelMap.get(key)
    if (controller) {
      // keep compatibility: attach signal so downstream can read it
      ;(data as any).signal = controller.signal
    }
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
  service.get = function (url: string, params: Record<string, any> = {}, config: Merge<AxiosRequestConfig<any>, { retry?: number }> = {}) {
    const key = generateKey({ url, method: 'get', params })
    const { retry = 0 } = config
    const call = () => {
      const controller = new AbortController()
      cancelInterceptor(key, controller)
      return Get.call(service, url, {
        signal: controller.signal,
        params,
        ...config,
      })
    }
    return promiseCall(call, retry)
  } as typeof axios.get

  const Post = service.post
  service.post = function (url: string, data: Record<string, any> = {}, config: Merge<AxiosRequestConfig<any>, { retry?: number }> = {}) {
    const key = generateKey({ url, method: 'post', data })
    const { retry = 0 } = config
    const call = () => {
      const controller = new AbortController()
      cancelInterceptor(key, controller)
      return Post.call(service, url, data, {
        signal: controller.signal,
        ...config,
      })
    }
    return promiseCall(call, retry)
  } as typeof axios.post

  const Put = service.put
  service.put = function (url: string, data: Record<string, any> = {}, config: Merge<AxiosRequestConfig<any>, { retry?: number }> = {}) {
    const key = generateKey({ url, method: 'put', data })
    const { retry = 0 } = config
    const call = () => {
      const controller = new AbortController()
      cancelInterceptor(key, controller)
      return Put.call(service, url, data, {
        signal: controller.signal,
        ...config,
      })
    }
    return promiseCall(call, retry)
  } as typeof axios.put

  const Delete = service.delete
  service.delete = function (url: string, params: Record<string, any> = {}, config: Merge<AxiosRequestConfig<any>, { retry?: number }> = {}) {
    const key = generateKey({ url, method: 'delete', params })
    const { retry = 0 } = config
    const call = () => {
      const controller = new AbortController()
      cancelInterceptor(key, controller)
      return Delete.call(service, url, {
        signal: controller.signal,
        params,
        ...config,
      })
    }
    return promiseCall(call, retry)
  } as typeof axios.delete

  return service

  function cancelInterceptor(key: string, c: AbortController) {
    if (cancelMap.has(key)) {
      const prev = cancelMap.get(key)
      prev?.abort()
    }
    cancelMap.set(key, c)
  }
}

export function generateKey(config: AxiosRequestConfig) {
  const url = config.url || ''
  const method = ((config.method || 'get') as string).toLowerCase()
  const payload = method === 'get' ? (config.params ?? undefined) : (config.data ?? undefined)
  return `${url}-${method}-${stableStringify(payload)}`
}

async function promiseCall(call: () => Promise<any>, retry: number) {
  let lastErr: any
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      return await call()
    }
    catch (err) {
      lastErr = err
      if (attempt === retry)
        throw lastErr
      // small tick before retry to avoid tight loop
      await new Promise(r => setTimeout(r, 0))
    }
  }
}
