import axios from 'axios';
import { API } from '../api';

enum CspUserMethods {
  CREATE = '/elections/{electionId}/users',
  GET = '/elections/{electionId}/users/{id}',
  UPDATE = '/elections/{electionId}/users/{id}',
  DELETE = '/elections/{electionId}/users/{id}',
  LIST = '/elections/{electionId}/users',
  SEARCH = '/elections/{electionId}/users',
}

export interface IUser {
  userId?: string;
  electionId: string;
  handler: string;
  service: string;
  mode: string;
  data: string;
  consumed: boolean;
}

export interface IUserUpdate {
  consumed: boolean;
}

export interface IUserDeleted {
  ok: boolean;
  reason?: string;
}

export abstract class User extends API {
  /**
   * Cannot be constructed.
   */
  private constructor() {
    super();
  }

  /**
   * Adds a new user to an existing election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUser} data
   *
   * @returns {Promise<IUser>}
   */
  public static create(url: string, authToken: string, electionId: string, data: IUser): Promise<IUser> {
    return axios
      .post(`${url + CspUserMethods.CREATE.replace('{electionId}', electionId)}`, data, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  /**
   * Get a user belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id
   *
   * @returns {Promise<IUser>}
   */
  public static get(url: string, authToken: string, electionId: string, id: string): Promise<IUser> {
    return axios
      .get(`${url + CspUserMethods.GET.replace('{electionId}', electionId).replace('{id}', id)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  /**
   * Update a user belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id
   * @param {IUser} data
   *
   * @returns {Promise<IUser>}
   */
  public static update(
    url: string,
    authToken: string,
    electionId: string,
    id: string,
    data: IUserUpdate
  ): Promise<IUser> {
    return axios
      .put(`${url + CspUserMethods.UPDATE.replace('{electionId}', electionId).replace('{id}', id)}`, data, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
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
      .catch(this.isApiError);
  }

  /**
   * List all users belonging to an election
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   *
   * @returns {Promise<IUser[]>}
   */
  public static list(url: string, authToken: string, electionId: string): Promise<IUser[]> {
    return axios
      .get(`${url + CspUserMethods.LIST.replace('{electionId}', electionId)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  /**
   * Search users matching a query
   *
   * @param {string} url CSP admin endpoint URL
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUser} query
   *
   * @returns {Promise<IUser[]>}
   */
  public static search(url: string, authToken: string, electionId: string, query: IUser): Promise<IUser[]> {
    return axios
      .post(`${url + CspUserMethods.SEARCH.replace('{electionId}', electionId)}?q=${query}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
  }
}
