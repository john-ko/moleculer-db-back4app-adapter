import { createMock } from 'ts-auto-mock'
import { AxiosStatic, AxiosRequestConfig } from 'axios'
import { On, method } from 'ts-auto-mock/extension'

import axiosFactory from './axios'

describe('axios', () => {
  it('creates a instance of axios', () => {
    // given mocks
    const axiosRequestConfig = createMock<AxiosRequestConfig>()
    const axiosMock = createMock<AxiosStatic>()
    const mockMethod: jest.Mock = On(axiosMock).get(method('create'));

   // when axiosFactory is called
    axiosFactory(axiosMock, axiosRequestConfig)

    expect(mockMethod).toHaveBeenCalled()
  })
})