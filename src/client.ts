import { CspAPI } from './api/csp';
import { IElection } from './api/csp/election';
import { IUser, IUserUpdate, IUserSearch } from './api/csp/user';

/**
 * Optional VocdoniSDKClient arguments
 *
 * @typedef ClientOptions
 * @property {string | null } api_url API url location
 */
export type ClientOptions = {
  csp_url?: string;
};

/**
 * Main Vocdoni Admin client object. It's a wrapper for all the methods in admin apis, core
 * and types, allowing you to easily use the Vocdoni Admin API from a single entry
 * point.
 */
export class VocdoniAdminSDKClient {
  public csp_url: string;

  /**
   * Instantiate new VocdoniAdminSDK client.
   *
   * To instantiate the client just pass the `ClientOptions` you want or empty object to let defaults.
   *
   * `const client = new VocdoniAdminSDKClient({csp_url: 'https://csp.vocdoni.net'})`
   *
   * @param {ClientOptions} opts optional arguments
   */
  constructor(opts: ClientOptions) {
    this.csp_url = opts.csp_url ?? null;
  }

  /**
   * Creates a new Election in the CSP with the provided details.
   * This will enable the voter to verify it belongs to the election, and proceed with a signature.
   *
   * @param {IElection} data
   * @returns {Promise<IElectionCreated>} Includes the adminToken and the election data
   */
  async cspElectionCreate(data: IElection) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionCreate(this.csp_url, data);
  }

  /**
   * Get the election details
   *
   * @param {string} electionId
   * @returns {Promise<IElection>}
   */
  async cspElectionGet(electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionGet(this.csp_url, electionId);
  }

  /**
   * Delete the election
   *
   * @param {string} electionId
   * @returns {Promise<IElectionDeleted>}
   */
  async cspElectionDelete(authToken: string, electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionDelete(this.csp_url, authToken, electionId);
  }

  /**
   * Get a list of elections ids
   *
   * @returns {Promise<string[]>}
   */
  async cspElectionList() {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionList(this.csp_url);
  }

  /**
   * Adds a new user to an existing election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUser} data
   * @returns {Promise<IUser>}
   */
  async cspUserCreate(authToken: string, electionId: string, data: IUser) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userCreate(this.csp_url, authToken, electionId, data);
  }

  /**
   * Get the user details for and election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @returns {Promise<IUser>}
   */
  async cspUserGet(authToken: string, electionId: string, id: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userGet(this.csp_url, authToken, electionId, id);
  }

  /**
   * Updates the allowed fields for a user in an election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @param {IUserUpdate} data
   * @returns {Promise<IUser>}
   */
  async cspUserUpdate(authToken: string, electionId: string, id: string, data: IUserUpdate) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userUpdate(this.csp_url, authToken, electionId, id, data);
  }

  /**
   * Deletes a user from an election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @returns {Promise<IUser>}
   */
  async cspUserDelete(authToken: string, electionId: string, id: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userDelete(this.csp_url, authToken, electionId, id);
  }

  /**
   * Get a list of users for an election
   *
   * @param {string} authToken
   * @param {string} electionId
   * @returns {Promise<IUser[]>}
   */
  async cspUserList(authToken: string, electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userList(this.csp_url, authToken, electionId);
  }

  /**
   * Get a list of users for an election that matches the query criteria
   *
   * @param {string} authToken Token to authenticate the request
   * @param electionId
   * @param {IUserSearch} query The query to filter the users
   * @returns {Promise<IUser[]>}
   */
  async cspUserSearch(authToken: string, electionId: string, query: IUserSearch) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userSearch(this.csp_url, authToken, electionId, query);
  }
}
