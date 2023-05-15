import axios from 'axios';
import { API } from '../api';

enum CspElectionMethods {
  CREATE = '/elections',
  GET = '/elections/{id}',
  DELETE = '/elections/{id}',
  LIST = '/elections',
}

export interface IElection {
  electionId: string;
  handlers: IHandler[];
}

export interface IHandler {
  handler: string;
  service: string;
  mode: string;
  data: string[];
}

export interface IElectionCreated {
  adminToken: string;
  data: IElection;
}

export interface IElectionDeleted {
  ok: boolean;
  reason?: string;
}

export abstract class Election extends API {
  /**
   * Cannot be constructed.
   */
  private constructor() {
    super();
  }

  /**
   * Create a new election
   * @param {string} url CSP admin endpoint URL
   * @param {any} election Election object
   *
   * @returns {Promise<IElectionCreated>} Election object
   */
  public static create(url: string, data: IElection): Promise<IElectionCreated> {
    return axios
      .post(`${url + CspElectionMethods.CREATE}`, data)
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  public static get(url: string, id: string): Promise<IElection> {
    return axios
      .get(`${url + CspElectionMethods.GET.replace('{id}', id)}`)
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  public static delete(url: string, authToken: string, id: string): Promise<IElectionDeleted> {
    return axios
      .delete(`${url + CspElectionMethods.DELETE.replace('{id}', id)}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((response) => response.data)
      .catch(this.isApiError);
  }

  public static list(url: string): Promise<string[]> {
    return axios
      .get(`${url + CspElectionMethods.LIST}`)
      .then((response) => response.data)
      .catch(this.isApiError);
  }
}
