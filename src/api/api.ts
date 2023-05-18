import axios, { AxiosError } from 'axios';
import { ErrAPI } from './errors';

export abstract class API {
  /**
   * Cannot be constructed.
   */
  protected constructor() {}

  protected static isApiError(error: AxiosError): never {
    if (!axios.isAxiosError(error)) throw error;
    const err = error?.response?.data;

    if (err && err['code'] && !isNaN(Number(err['code']))) {
      switch (err['code']) {
        case '401':
          throw new ErrUnauthorizedAuthToken(err['reason']);
        default:
          return API.isUndefinedError(error, err['error']);
      }
    } else if (err) {
      return API.isUndefinedError(error, err as string);
    }

    return API.isUndefinedError(error);
  }

  private static isUndefinedError(error: AxiosError, message?: string): never {
    throw new ErrAPI(error.response.status + ' ' + error.response.statusText + ': ' + message, error);
  }
}

export class ErrUnauthorizedAuthToken extends Error {
  constructor(message?: string) {
    super(message ? message : 'Authentication failed');
  }
}
