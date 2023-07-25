import axios from 'axios'
import { API } from '../api'

enum CspUserMethods {
  CREATE = '/elections/{electionId}/users',
  GET = '/elections/{electionId}/users/{id}',
  UPDATE = '/elections/{electionId}/users/{id}',
  DELETE = '/elections/{electionId}/users/{id}',
  LIST = '/elections/{electionId}/users',
  SEARCH = '/elections/{electionId}/users/search',
}

export interface IUserElection {
  userId?: string
  electionId: string
  consumed: boolean
}

export interface IUserElectionComplete extends IUserElection {
  user: IUser
}

export interface IUser {
  userId?: string
  handler: string
  service: string
  mode: string
  data: string
}

export interface IUserRequest {
  userId?: string
  electionId: string
  handler: string
  service: string
  mode: string
  data: string
  consumed: boolean
}

export interface IUserSearch {
  userId?: string
  electionId?: string
  handler?: string
  service?: string
  mode?: string
  data?: string
  consumed?: boolean
}

export interface IUserUpdate {
  consumed: boolean
}

export interface IUserDeleted {
  ok: boolean
  reason?: string
}

export abstract class User extends API {
  /**
   * Cannot be constructed.
   */
  private constructor() {
    super()
  }

  /**
   * Adds a new user to an existing election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUserRequest} data
   *
   * @returns {Promise<IUserElectionComplete>}
   */
  public static create(
    url: string,
    authToken: string,
    electionId: string,
    data: IUserRequest
  ): Promise<IUserElectionComplete> {
    return axios
      .post(`${url + CspUserMethods.CREATE.replace('{electionId}', electionId)}`, data, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Get a user belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id
   *
   * @returns {Promise<IUserElectionComplete>}
   */
  public static get(url: string, authToken: string, electionId: string, id: string): Promise<IUserElectionComplete> {
    return axios
      .get(`${url + CspUserMethods.GET.replace('{electionId}', electionId).replace('{id}', id)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Update a user belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id
   * @param {IUserUpdate} data
   *
   * @returns {Promise<IUserElectionComplete>}
   */
  public static update(
    url: string,
    authToken: string,
    electionId: string,
    id: string,
    data: IUserUpdate
  ): Promise<IUserElectionComplete> {
    return axios
      .put(`${url + CspUserMethods.UPDATE.replace('{electionId}', electionId).replace('{id}', id)}`, data, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Delete a user belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id
   *
   * @returns {Promise<IUserDeleted>}
   */
  public static delete(url: string, authToken: string, electionId: string, id: string): Promise<IUserDeleted> {
    return axios
      .delete(`${url + CspUserMethods.DELETE.replace('{electionId}', electionId).replace('{id}', id)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError)
  }

  /**
   * List all users belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   *
   * @returns {Promise<IUserElectionComplete[]>}
   */
  public static list(url: string, authToken: string, electionId: string): Promise<IUserElectionComplete[]> {
    return axios
      .get(`${url + CspUserMethods.LIST.replace('{electionId}', electionId)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Search users matching a query
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUserSearch} query
   *
   * @returns {Promise<IUserElectionComplete[]>}
   */
  public static search(
    url: string,
    authToken: string,
    electionId: string,
    query: IUserSearch
  ): Promise<IUserElectionComplete[]> {
    return axios
      .post(`${url + CspUserMethods.SEARCH.replace('{electionId}', electionId)}`, query, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }
}
