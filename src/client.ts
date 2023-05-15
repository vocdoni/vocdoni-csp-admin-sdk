import { CspAPI } from './api/csp';
import { IElection } from './api/csp/election';
import { IUser } from './api/csp/user';

export enum EnvOptions {
  DEV = 'dev',
  STG = 'stg',
  PROD = 'prod',
}

/**
 * Optional VocdoniSDKClient arguments
 *
 * @typedef ClientOptions
 * @property {EnvOptions} env enum with possible values `DEV`, `STG`, `PROD`
 * @property {string | null } api_url API url location
 */
export type ClientOptions = {
  csp_url?: string;
};

export class VocdoniAdminSDKClient {
  public csp_url: string;

  /**
   * Instantiate new VocdoniAdminSDK client.
   *
   * To instantiate the client just pass the `ClientOptions` you want or empty object to let defaults.
   *
   * `const client = new VocdoniAdminSDKClient({EnvOptions.PROD})`
   *
   * @param {ClientOptions} opts optional arguments
   */
  constructor(opts: ClientOptions) {
    this.csp_url = opts.csp_url ?? null;
  }

  async cspElectionCreate(data: IElection) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionCreate(this.csp_url, data);
  }

  async cspElectionGet(electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionGet(this.csp_url, electionId);
  }

  async cspElectionDelete(authToken: string, electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionDelete(this.csp_url, authToken, electionId);
  }

  async cspElectionList() {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.electionList(this.csp_url);
  }

  async cspUserCreate(authToken: string, electionId: string, data: IUser) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userCreate(this.csp_url, authToken, electionId, data);
  }

  async cspUserGet(authToken: string, electionId: string, id: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userGet(this.csp_url, authToken, electionId, id);
  }

  async cspUserUpdate(authToken: string, electionId: string, id: string, data: IUser) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userUpdate(this.csp_url, authToken, electionId, id, data);
  }

  async cspUserDelete(authToken: string, electionId: string, id: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userDelete(this.csp_url, authToken, electionId, id);
  }

  async cspUserList(authToken: string, electionId: string) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userList(this.csp_url, authToken, electionId);
  }

  async cspUserSearch(authToken: string, electionId: string, query: IUser) {
    if (!this.csp_url) {
      throw new Error('Csp URL not set');
    }

    return CspAPI.userSearch(this.csp_url, authToken, electionId, query);
  }
}
