import { Signer, Wallet } from 'ethers'
import { CspAPI } from './api/csp'
import { IElection, IElectionWithTokenResponse, IElectionDeleted, IElectionAuth } from './api/csp/election'
import { IUserUpdate, IUserSearch, IUserDeleted, IUserRequest, IUserElectionComplete } from './api/csp/user'

export * from './api/csp/user'
export * from './api/csp/election'

/**
 * Optional VocdoniSDKClient arguments
 *
 * @typedef CspAdminClientOptions
 * @property {string | null } cspUrl API url location
 * @property {Wallet | Signer } wallet Ethereum wallet or signer
 */
export type CspAdminClientOptions = {
  cspUrl?: string
  wallet?: Wallet | Signer
}

/**
 * Main Vocdoni Admin client object. It's a wrapper for all the methods in admin apis, core
 * and types, allowing you to easily use the Vocdoni Admin API from a single entry
 * point.
 */
export class VocdoniAdminSDKClient {
  public cspUrl: string
  public wallet: Wallet | Signer | null

  /**
   * Instantiate new VocdoniAdminSDK client.
   *
   * To instantiate the client just pass the `CspAdminClientOptions` you want or empty object to let defaults.
   *
   * `const client = new VocdoniAdminSDKClient({cspUrl: 'https://csp.vocdoni.net'})`
   *
   * @param {CspAdminClientOptions} opts optional arguments
   */
  constructor(opts: CspAdminClientOptions) {
    this.cspUrl = opts.cspUrl ?? null
    this.wallet = opts.wallet ?? null
  }

  /**
   * Set the CSP Wallet
   * @param {Wallet | Signer} wallet
   * @returns {void}
   */
  setWallet(wallet: Wallet | Signer) {
    this.wallet = wallet
  }

  /**
   * Creates a new Election in the CSP with the provided details.
   * This will enable the voter to verify it belongs to the election, and proceed with a signature.
   *
   * @param {IElection} data
   * @returns {Promise<IElectionWithTokenResponse>} Includes the adminToken and the election data
   */
  async cspElectionCreate(data: IElection): Promise<IElectionWithTokenResponse> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.electionCreate(this.cspUrl, data)
  }

  /**
   * Retrieves the election adminToken from the CSP with the provided details.
   *
   * @param {string} electionId
   * @param {string} message // The message to sign
   * @returns {Promise<IElectionWithTokenResponse>} Includes the adminToken and the election data
   */
  async cspElectionAuth(electionId: string, message: string): Promise<IElectionWithTokenResponse> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }
    if (!this.wallet) {
      throw new Error('Csp Wallet not set')
    }

    // const hashMessage = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(message))
    const auth: IElectionAuth = {
      signature: await this.wallet.signMessage(message),
      data: message,
    }

    return CspAPI.electionAuth(this.cspUrl, electionId, auth)
  }

  /**
   * Get the election details
   *
   * @param {string} electionId
   * @returns {Promise<IElection>}
   */
  async cspElectionGet(electionId: string): Promise<IElection> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.electionGet(this.cspUrl, electionId)
  }

  /**
   * Delete the election
   *
   * @param {string} electionId
   * @returns {Promise<IElectionDeleted>}
   */
  async cspElectionDelete(authToken: string, electionId: string): Promise<IElectionDeleted> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.electionDelete(this.cspUrl, authToken, electionId)
  }

  /**
   * Get a list of elections ids
   *
   * @returns {Promise<string[]>}
   */
  async cspElectionList(): Promise<string[]> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.electionList(this.cspUrl)
  }

  /**
   * Adds a new user to an existing election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {IUserRequest} data
   * @returns {Promise<IUserElectionComplete>}
   */
  async cspUserCreate(authToken: string, electionId: string, data: IUserRequest): Promise<IUserElectionComplete> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userCreate(this.cspUrl, authToken, electionId, data)
  }

  /**
   * Get the user details for and election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @returns {Promise<IUserElectionComplete>}
   */
  async cspUserGet(authToken: string, electionId: string, id: string): Promise<IUserElectionComplete> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userGet(this.cspUrl, authToken, electionId, id)
  }

  /**
   * Updates the allowed fields for a user in an election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @param {IUserUpdate} data
   * @returns {Promise<IUserElectionComplete>}
   */
  async cspUserUpdate(
    authToken: string,
    electionId: string,
    id: string,
    data: IUserUpdate
  ): Promise<IUserElectionComplete> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userUpdate(this.cspUrl, authToken, electionId, id, data)
  }

  /**
   * Deletes a user from an election
   *
   * @param {string} authToken Token to authenticate the request
   * @param {string} electionId
   * @param {string} id The user id
   * @returns {Promise<IUserDeleted>}
   */
  async cspUserDelete(authToken: string, electionId: string, id: string): Promise<IUserDeleted> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userDelete(this.cspUrl, authToken, electionId, id)
  }

  /**
   * Get a list of users for an election
   *
   * @param {string} authToken
   * @param {string} electionId
   * @returns {Promise<IUserElectionComplete[]>}
   */
  async cspUserList(authToken: string, electionId: string): Promise<IUserElectionComplete[]> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userList(this.cspUrl, authToken, electionId)
  }

  /**
   * Get a list of users for an election that matches the query criteria
   *
   * @param {string} authToken Token to authenticate the request
   * @param electionId
   * @param {IUserSearch} query The query to filter the users
   * @returns {Promise<IUserElectionComplete[]>}
   */
  async cspUserSearch(authToken: string, electionId: string, query: IUserSearch): Promise<IUserElectionComplete[]> {
    if (!this.cspUrl) {
      throw new Error('Csp URL not set')
    }

    return CspAPI.userSearch(this.cspUrl, authToken, electionId, query)
  }
}
