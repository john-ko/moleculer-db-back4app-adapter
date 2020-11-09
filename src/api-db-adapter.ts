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

  constructor(axios: AxiosInstance, uri: string, dbName?: string, opts?: ApiDbAdapterOptions,) {
    this.uri = uri
    this.opts = opts ?? {}
    this.dbName = dbName ?? ''
    this.axios = axios
  }

  init(broker: ServiceBroker, service: Service) {
    this.broker = broker
    this.service = service

    // todo need to figure this out
    // if (!this.service.schema.collection) {
    //   throw new Errors.MoleculerServerError('Missing `collection` definition in schema of service!')
    // }
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

  entityToObject(entity: any) {
    return entity
  }
  createCursor(params: any, isCounting: boolean) {
    // todo implement
  }
  transformSort(paramSort: any) {
    // todo implement
  }

  stringToObjectID(id: string) { return id }
  objectIDToString(id: string) { return id }
  beforeSaveTransformID (entity: any, idField: string) {
    entity[idField] = entity.id
    delete entity.id

    return entity
  }

  afterRetrieveTransformID (entity: any, idField: string) {
    entity.id = entity[idField]
    delete entity[idField]

    return entity
  }
}