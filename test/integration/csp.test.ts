import { VocdoniAdminSDKClient } from '../../src/';
import { IElection, IElectionCreated, IElectionDeleted } from '../../src/api/csp/election';
import { IUser, IUserDeleted } from '../../src/api/csp/user';

const CSP_URL = 'http://localhost:5000/v1/auth/elections/admin';

function generateRandomHex(length: number): string {
  const characters = '0123456789abcdef';
  let hexString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hexString += characters.charAt(randomIndex);
  }

  return hexString;
}

describe('CSP Admin Tests', () => {
  it('Should create a couple of elections correctly, getting, listing and finally deleting them', async () => {
    const client = new VocdoniAdminSDKClient({ csp_url: CSP_URL });
    const electionOne: IElection = {
      electionId: generateRandomHex(64),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['one@gmail.com', 'two@gmail.com'],
        },
        {
          handler: 'oauth',
          service: 'github',
          mode: 'usernames',
          data: ['one', 'two'],
        },
      ],
    };

    const electionTwo: IElection = {
      electionId: generateRandomHex(64),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['three@gmail.com'],
        },
        {
          handler: 'oauth',
          service: 'github',
          mode: 'usernames',
          data: ['three'],
        },
      ],
    };

    const createdOne: IElectionCreated = await client.cspElectionCreate(electionOne);
    const createdTwo: IElectionCreated = await client.cspElectionCreate(electionTwo);
    expect(createdOne).toHaveProperty('adminToken');
    expect(createdTwo).toHaveProperty('adminToken');

    const fetchedOne: IElection = await client.cspElectionGet(electionOne.electionId);
    const fetchedTwo: IElection = await client.cspElectionGet(electionTwo.electionId);
    expect(createdOne.data).toEqual(fetchedOne);
    expect(createdTwo.data).toEqual(fetchedTwo);

    let listed: string[] = await client.cspElectionList();
    expect(listed).toContain(createdOne.data.electionId);
    expect(listed).toContain(createdTwo.data.electionId);

    let deleted: IElectionDeleted = await client.cspElectionDelete(createdOne.adminToken, electionOne.electionId);
    expect(deleted.ok).toEqual('true');
    deleted = await client.cspElectionDelete(createdTwo.adminToken, electionTwo.electionId);
    expect(deleted.ok).toEqual('true');

    listed = await client.cspElectionList();
    expect(listed).not.toContain(createdOne.data.electionId);
    expect(listed).not.toContain(createdTwo.data.electionId);
  });

  it('Should be able to add, list, remove and other management users from an election', async () => {
    const client = new VocdoniAdminSDKClient({ csp_url: CSP_URL });
    const election: IElection = {
      electionId: generateRandomHex(64),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['hello@gmail.com'],
        },
      ],
    };
    const created: IElectionCreated = await client.cspElectionCreate(election);

    const user: IUser = {
      electionId: created.data.electionId,
      handler: 'oauth',
      service: 'facebook',
      mode: 'usernames',
      data: 'whatever@gmail.com',
      consumed: false,
    };
    const createdUser: IUser = await client.cspUserCreate(created.adminToken, election.electionId, user);
    const createdUserId: string = createdUser.userId as string;
    const copyUser = { ...createdUser };
    delete copyUser.userId;
    expect(user).toEqual(copyUser);

    // Get
    let fetchedUser: IUser = await client.cspUserGet(created.adminToken, election.electionId, createdUserId);
    expect(createdUser).toEqual(fetchedUser);

    // List
    let listed: IUser[] = await client.cspUserList(created.adminToken, election.electionId);
    expect(listed).toContainEqual(createdUser);

    // Update
    let updated: IUser = await client.cspUserUpdate(created.adminToken, election.electionId, createdUserId, {
      consumed: true,
    });
    fetchedUser = await client.cspUserGet(created.adminToken, election.electionId, createdUserId);
    expect(updated).toEqual(fetchedUser);
    expect(updated.consumed).toEqual(true);

    // Search
    let search: IUser[] = await client.cspUserSearch(created.adminToken, election.electionId, {
      consumed: true,
    });
    expect(search).toContainEqual(updated);

    // Delete
    const deleted: IUserDeleted = await client.cspUserDelete(created.adminToken, election.electionId, createdUserId);
    expect(deleted.ok).toEqual('true');

    listed = await client.cspUserList(created.adminToken, election.electionId);
    expect(listed).not.toContainEqual(createdUser);
  });

  it('Should fail when providing wrong authToken', async () => {
    const client = new VocdoniAdminSDKClient({ csp_url: CSP_URL });
    const election: IElection = {
      electionId: generateRandomHex(64),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['hello@gmail.com'],
        },
      ],
    };
    const created: IElectionCreated = await client.cspElectionCreate(election);
    const user: IUser = {
      electionId: created.data.electionId,
      handler: 'oauth',
      service: 'facebook',
      mode: 'usernames',
      data: 'whatever@gmail.com',
      consumed: false,
    };

    await expect(async () => {
      await client.cspElectionDelete('WrongAdminToken', election.electionId);
    }).rejects.toThrow('Authentication failed');

    await expect(async () => {
      await client.cspUserCreate('WrongAdminToken', election.electionId, user);
    }).rejects.toThrow('Authentication failed');

    const createdUser: IUser = await client.cspUserCreate(created.adminToken, election.electionId, user);

    await expect(async () => {
      await client.cspUserGet('WrongAdminToken', election.electionId, createdUser.userId as string);
    }).rejects.toThrow('Authentication failed');

    await expect(async () => {
      await client.cspUserUpdate('WrongAdminToken', election.electionId, createdUser.userId as string, {
        consumed: true,
      });
    }).rejects.toThrow('Authentication failed');

    await expect(async () => {
      await client.cspUserDelete('WrongAdminToken', election.electionId, createdUser.userId as string);
    }).rejects.toThrow('Authentication failed');

    await expect(async () => {
      await client.cspUserList('WrongAdminToken', election.electionId);
    }).rejects.toThrow('Authentication failed');

    await expect(async () => {
      await client.cspUserSearch('WrongAdminToken', election.electionId, { consumed: true });
    }).rejects.toThrow('Authentication failed');
  });
});
