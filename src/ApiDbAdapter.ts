import { Service, ServiceBroker, Errors } from 'moleculer'
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

export interface ApiDbAdapterOptions {
  headers?: {
    [key:string]: any
  }
  axios?: AxiosInstance
  timeout?: number
}

export interface ApiFilters {
  [key: string]: any
}

export interface ApiQuery {
  [key: string]: any
}

export function queryParams (params?: {[key: string]: any}) {
  params = params ?? {}

  const queryParams = Object.entries(params)
    .map(([key, value]) => {
      if (typeof value === 'object') {
        value = JSON.stringify(value)
      }

      return `${key}=${value}`
    })
    .join('&')

  return encodeURI(queryParams)
}

export default class ApiDbAdapter {
  uri: string
  opts: ApiDbAdapterOptions
  dbName: string
  broker?: ServiceBroker
  service?: Service
  axios: AxiosInstance

  constructor(uri: string, opts?: ApiDbAdapterOptions, dbName?: string) {
    this.uri = uri
    this.opts = opts ?? {}
    this.dbName = dbName ?? ''

    if (opts?.axios) {
      this.axios = opts.axios
      return
    }

    const axiosConfigOptions: AxiosRequestConfig = {
      baseURL: uri
    }

    if (opts?.headers) {
      axiosConfigOptions.headers = opts.headers
    }

    if (opts?.timeout) {
      axiosConfigOptions.timeout = opts.timeout
    }

    this.axios = axios.create(axiosConfigOptions)
  }

  init(broker: ServiceBroker, service: Service) {
    this.broker = broker
    this.service = service

    if (!this.service.schema.collection) {
      throw new Errors.MoleculerServerError('Missing `collection` definition in schema of service!')
    }
  }

  connect() { return Promise.resolve() }
  disconnect() { return Promise.resolve() }

  find (filters?: ApiFilters) {
    const params = { params: filters ?? {} }

    return this.axios.get(`classes/${this.dbName}`, params)
      .then(response => response.data)
  }

  findOne (query?: ApiQuery) {
    query = query ?? {}
    query.limit = 1

    return this.find(query)
  }

  findById(_id: string) {
    return this.axios.get(`classes/${this.dbName}/${_id}`)
    .then(response => {
      return response.data
    })
  }

  findByIds(idList: string[]) {
    const params = {
      params: {
        where: {
          objectId: { $in: idList }
        }
      }
    }

    return this.find(params)
  }

  count(filters?: ApiFilters) {
    const params = filters ?? {}
    params.count = 1

    return this.find(params)
  }

  insert(entity: any) {
    return this.axios.post(`classes/${this.dbName}`, entity)
      .then(response => response.data)
  }

  insertMany(entities: any) {}
  updateMany(query: ApiQuery, update: any) {}
  updateById(_id: string, update: any) {}
  removeMany(query: ApiQuery) {}

  removeById(_id: string) {
    return this.axios.delete(`classes/${this.dbName}/${_id}`)
      .then(response => response.data)
  }

  clear() {}
  entityToObject(entity: any) {}
  createCursor(params: any, isCounting: boolean) {}
  transformSort(paramSort: any) {}
  stringToObjectID(id: string) {}
  objectIDToString(id: string) {}
  beforeSaveTransformID (entity: any, idField: string) {}
  afterRetrieveTransformID (entity: any, idField: string) {}
}