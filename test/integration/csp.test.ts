// import { Wallet, ethers } from 'ethers'
// import { IElection, IElectionDeleted, IElectionWithTokenResponse } from '../../src/api/csp/election'
import { Wallet, ethers } from 'ethers'
import { IUserDeleted, IUserElectionComplete, IUserRequest, VocdoniAdminSDKClient } from '../../src/'
import { IElection, IElectionDeleted, IElectionWithTokenResponse } from '../../src/api/csp/election'

const cspUrl = 'http://localhost:5000/v1/auth/elections/admin'

function generateRandomHex(length: number): string {
  const characters = '0123456789abcdef'
  let hexString = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    hexString += characters.charAt(randomIndex)
  }

  return hexString
}

describe('CSP Admin Tests', () => {
  it('Should create a couple of elections correctly, getting, listing and finally deleting them', async () => {
    const client = new VocdoniAdminSDKClient({ cspUrl: cspUrl })
    const electionOne: IElection = {
      electionId: 'c5d2460186f7bb73137b620cffde1b3971a0c9023b480c851b700304000000' + generateRandomHex(2),
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
    }

    const electionTwo: IElection = {
      electionId: 'c5d2460186f7bb73137b620cffde1b3971a0c9023b480c851b700304000000' + generateRandomHex(2),
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
    }

    const createdOne: IElectionWithTokenResponse = await client.cspElectionCreate(electionOne)
    const createdTwo: IElectionWithTokenResponse = await client.cspElectionCreate(electionTwo)
    expect(createdOne).toHaveProperty('adminToken')
    expect(createdTwo).toHaveProperty('adminToken')

    const fetchedOne: IElection = await client.cspElectionGet(electionOne.electionId)
    const fetchedTwo: IElection = await client.cspElectionGet(electionTwo.electionId)
    expect(fetchedOne).toEqual(createdOne.election)
    expect(fetchedTwo).toEqual(createdTwo.election)

    let listed: string[] = await client.cspElectionList()
    expect(listed).toContain(createdOne.election.electionId)
    expect(listed).toContain(createdTwo.election.electionId)

    let deleted: IElectionDeleted = await client.cspElectionDelete(createdOne.adminToken, electionOne.electionId)
    expect(deleted.ok).toEqual(true)
    deleted = await client.cspElectionDelete(createdTwo.adminToken, electionTwo.electionId)
    expect(deleted.ok).toEqual(true)

    listed = await client.cspElectionList()
    expect(listed).not.toContain(createdOne.election.electionId)
    expect(listed).not.toContain(createdTwo.election.electionId)
  })

  it('Should be able to add, list, remove and other management users from an election', async () => {
    const client = new VocdoniAdminSDKClient({ cspUrl: cspUrl })
    const election: IElection = {
      electionId: 'c5d2460186f7bb73137b620cffde1b3971a0c9023b480c851b700304000000' + generateRandomHex(2),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['hello@gmail.com'],
        },
      ],
    }
    const created: IElectionWithTokenResponse = await client.cspElectionCreate(election)

    const user: IUserRequest = {
      electionId: created.election.electionId,
      handler: 'oauth',
      service: 'facebook',
      mode: 'usernames',
      data: 'whatever@gmail.com',
      consumed: false,
    }
    const createdUser: IUserElectionComplete = await client.cspUserCreate(created.adminToken, election.electionId, user)
    const createdUserId: string = createdUser.userId as string
    const user2: IUserElectionComplete = {
      electionId: user.electionId,
      user: {
        handler: user.handler,
        service: user.service,
        mode: user.mode,
        data: user.data,
      },
      consumed: user.consumed,
    }

    const copyUser = JSON.parse(JSON.stringify(createdUser))
    delete copyUser.userId
    delete copyUser.user.userId
    expect(user2).toEqual(copyUser)

    // Get
    let fetchedUser: IUserElectionComplete = await client.cspUserGet(
      created.adminToken,
      election.electionId,
      createdUserId
    )
    expect(createdUser).toEqual(fetchedUser)

    // List
    let listed: IUserElectionComplete[] = await client.cspUserList(created.adminToken, election.electionId)
    expect(listed).toContainEqual(createdUser)

    // Update
    let updated: IUserElectionComplete = await client.cspUserUpdate(
      created.adminToken,
      election.electionId,
      createdUserId,
      {
        consumed: true,
      }
    )
    fetchedUser = await client.cspUserGet(created.adminToken, election.electionId, createdUserId)
    expect(updated).toEqual(fetchedUser)
    expect(updated.consumed).toEqual(true)

    // Search
    let search: IUserElectionComplete[] = await client.cspUserSearch(created.adminToken, election.electionId, {
      consumed: true,
    })
    expect(search).toContainEqual(updated)

    // Delete
    const deleted: IUserDeleted = await client.cspUserDelete(created.adminToken, election.electionId, createdUserId)
    expect(deleted.ok).toEqual(true)

    listed = await client.cspUserList(created.adminToken, election.electionId)
    expect(listed).not.toContainEqual(createdUser)
  })

  it('Should fail when providing wrong adminToken', async () => {
    const client = new VocdoniAdminSDKClient({ cspUrl: cspUrl })
    const election: IElection = {
      electionId: 'c5d2460186f7bb73137b620cffde1b3971a0c9023b480c851b700304000000' + generateRandomHex(2),
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['hello@gmail.com'],
        },
      ],
    }
    const created: IElectionWithTokenResponse = await client.cspElectionCreate(election)
    const user: IUserRequest = {
      electionId: created.election.electionId,
      handler: 'oauth',
      service: 'facebook',
      mode: 'usernames',
      data: 'whatever@gmail.com',
      consumed: false,
    }

    await expect(async () => {
      await client.cspElectionDelete('WrongAdminToken', election.electionId)
    }).rejects.toThrow('Authentication failed')

    await expect(async () => {
      await client.cspUserCreate('WrongAdminToken', election.electionId, user)
    }).rejects.toThrow('Authentication failed')

    const createdUser: IUserElectionComplete = await client.cspUserCreate(created.adminToken, election.electionId, user)

    await expect(async () => {
      await client.cspUserGet('WrongAdminToken', election.electionId, createdUser.userId as string)
    }).rejects.toThrow('Authentication failed')

    await expect(async () => {
      await client.cspUserUpdate('WrongAdminToken', election.electionId, createdUser.userId as string, {
        consumed: true,
      })
    }).rejects.toThrow('Authentication failed')

    await expect(async () => {
      await client.cspUserDelete('WrongAdminToken', election.electionId, createdUser.userId as string)
    }).rejects.toThrow('Authentication failed')

    await expect(async () => {
      await client.cspUserList('WrongAdminToken', election.electionId)
    }).rejects.toThrow('Authentication failed')

    await expect(async () => {
      await client.cspUserSearch('WrongAdminToken', election.electionId, { consumed: true })
    }).rejects.toThrow('Authentication failed')
  })

  it('Should create an election and get the adminToken later on', async () => {
    const client = new VocdoniAdminSDKClient({ cspUrl: cspUrl })

    const wallet: Wallet = ethers.Wallet.createRandom()
    let electionId = 'c5d2460186f7bb73137b620cffde1b3971a0c9023b480c851b700304000000' + generateRandomHex(2)

    // Replace electionId chars from 12 to 52 with wallet address
    electionId = electionId.slice(0, 12) + wallet.address.slice(2).toLowerCase() + electionId.slice(52)

    const election: IElection = {
      electionId,
      handlers: [
        {
          handler: 'oauth',
          service: 'facebook',
          mode: 'usernames',
          data: ['hello@gmail.com'],
        },
      ],
    }
    const created: IElectionWithTokenResponse = await client.cspElectionCreate(election)

    await expect(async () => {
      await client.cspElectionAuth(created.election.electionId, 'hello')
    }).rejects.toThrow('Csp Wallet not set')

    client.setWallet(wallet)

    const auth: IElectionWithTokenResponse = await client.cspElectionAuth(created.election.electionId, 'hello')
    expect(auth.adminToken).toEqual(created.adminToken)

    // Verify adminToken works
    let deleted: IElectionDeleted = await client.cspElectionDelete(created.adminToken, created.election.electionId)
    expect(deleted.ok).toEqual(true)

    let listed = await client.cspElectionList()
    expect(listed).not.toContain(created.election.electionId)
  })
})
