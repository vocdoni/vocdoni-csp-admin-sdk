import axios from 'axios'
import { API } from '../api'

enum CspElectionMethods {
  CREATE = '/elections',
  GET = '/elections/{id}',
  AUTH = '/elections/{id}/auth',
  DELETE = '/elections/{id}',
  LIST = '/elections',
}

export interface IElection {
  electionId: string
  handlers: IHandler[]
}

export interface IHandler {
  handler: string
  service: string
  mode: string
  data: string[]
}

export interface IElectionAuth {
  signature: string
  data: string
}

export interface IElectionWithTokenResponse {
  adminToken: string
  election: IElection
}

export interface IElectionDeleted {
  ok: boolean
  reason?: string
}

export abstract class Election extends API {
  /**
   * Cannot be constructed.
   */
  private constructor() {
    super()
  }

  /**
   * Create a new election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {IElection } data Election object
   *
   * @returns {Promise<IElectionWithTokenResponse>} Election object
   */
  public static create(url: string, data: IElection): Promise<IElectionWithTokenResponse> {
    return axios
      .post(`${url + CspElectionMethods.CREATE}`, data)
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Authenticate for an election, getting a token for future requests
   *
   * @param {string} url
   * @param {IElectionAuth} data Auth object
   * @returns  {Promise<IElectionWithTokenResponse>} Election object with token
   */
  public static auth(url: string, id: string, data: IElectionAuth): Promise<IElectionWithTokenResponse> {
    return axios
      .post(`${url + CspElectionMethods.AUTH.replace('{id}', id)}`, data)
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }

  /**
   * Get an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} id Election ID
   *
   * @returns {Promise<IElection>}
   */
  public static get(url: string, id: string): Promise<IElection> {
    return axios
      .get(`${url + CspElectionMethods.GET.replace('{id}', id)}`)
      .then((response) => {
        let ret = response.data
        if (ret.data != null) return ret.data

        return ret
      })
      .catch(this.isApiError)
  }

  /**
   * Delete an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken CSP admin auth token
   * @param {string} id Election ID
   *
   * @returns {Promise<IElectionDeleted>}
   */
  public static delete(url: string, authToken: string, id: string): Promise<IElectionDeleted> {
    return axios
      .delete(`${url + CspElectionMethods.DELETE.replace('{id}', id)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError)
  }

  /**
   * List all elections
   *
   * @param {string} url CSP admin endpoint URL
   *
   * @returns {Promise<string[]>}
   */
  public static list(url: string): Promise<string[]> {
    return axios
      .get(`${url + CspElectionMethods.LIST}`)
      .then((response) => response.data.data)
      .catch(this.isApiError)
  }
}
