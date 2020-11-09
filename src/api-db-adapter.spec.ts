import { createMock } from 'ts-auto-mock'
import { AxiosStatic } from 'axios'
import { On, method } from 'ts-auto-mock/extension'

import ApiDbAdapter from './api-db-adapter'

describe('api-db-adapter', () => {
  it('findOne', async () => {
    const axiosMock = createMock<AxiosStatic>()
    const apiAdapter = new ApiDbAdapter(axiosMock, 'some-url', 'classname')
    const mockMethod: jest.Mock = On(axiosMock).get(method('get'))

    const response = await apiAdapter.findOne({ id: '123'})

    expect(mockMethod).toHaveBeenCalled()
    expect(mockMethod).toHaveBeenLastCalledWith('classes/classname', {params: {id: '123', limit: 1}})
  })
})