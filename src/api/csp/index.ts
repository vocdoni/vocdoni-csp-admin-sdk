import { API } from '../api';
import { Election, IElection, IElectionCreated, IElectionDeleted } from './election';
import { User, IUser, IUserUpdate, IUserDeleted } from './user';

export abstract class CspAPI extends API {
  /**
   * Cannot be constructed.
   */
  private constructor() {
    super();
  }

  public static electionCreate(url: string, data: IElection): Promise<IElectionCreated> {
    return Election.create(url, data);
  }

  public static electionGet(url: string, electionId: string): Promise<IElection> {
    return Election.get(url, electionId);
  }

  public static electionDelete(url: string, authToken: string, electionId: string): Promise<IElectionDeleted> {
    return Election.delete(url, authToken, electionId);
  }

  public static electionList(url: string): Promise<string[]> {
    return Election.list(url);
  }

  public static userCreate(url: string, authToken: string, electionId: string, data: IUser): Promise<IUser> {
    return User.create(url, authToken, electionId, data);
  }

  public static userGet(url: string, authToken: string, electionId: string, id: string): Promise<IUser> {
    return User.get(url, authToken, electionId, id);
  }

  public static userUpdate(
    url: string,
    authToken: string,
    electionId: string,
    id: string,
    data: IUserUpdate
  ): Promise<IUser> {
    return User.update(url, authToken, electionId, id, data);
  }

  public static userDelete(url: string, authToken: string, electionId: string, id: string): Promise<IUserDeleted> {
    return User.delete(url, authToken, electionId, id);
  }

  public static userList(url: string, authToken: string, electionId: string): Promise<IUser[]> {
    return User.list(url, authToken, electionId);
  }

  public static userSearch(url: string, authToken: string, electionId: string, query: IUser): Promise<IUser[]> {
    return User.search(url, authToken, electionId, query);
  }
}
