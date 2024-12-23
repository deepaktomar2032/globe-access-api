import { AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'
import { STATUS_CODES } from '@src/constants'

export const getDelay = (attempt: number, baseDelay: number, maxDelay: number): number => {
  const two: number = 2
  const tempDelay: number = Math.min(maxDelay, baseDelay * two ** attempt)

  return Math.round(tempDelay / two + Math.random() * (tempDelay / two))
}

export const attachExponentialBackoffInterceptor = (
  instance: AxiosInstance,
  maxRetries: number = 5,
  baseDelay: number = 400,
  maxDelay: number = 5000
) => {
  let retryCount: number = 0

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      if (
        (error.response?.status === STATUS_CODES.TOO_MANY_REQUESTS ||
          error.response?.status >= STATUS_CODES.SERVER_ERROR) &&
        retryCount < maxRetries
      ) {
        retryCount = retryCount + 1
        const delay: number = getDelay(retryCount, baseDelay, maxDelay)

        console.warn('ExponentialBackoffInterceptor:', {
          delay,
          retryCount,
          status: error.response?.status,
          url: error.response.request.url
        })

        return new Promise<AxiosResponse>((resolve: (value: AxiosResponse) => void) => {
          setTimeout(async () => {
            return resolve(await instance.request(error.config))
          }, delay)
        })
      }
      retryCount = 0

      return Promise.reject(error)
    }
  )
}
