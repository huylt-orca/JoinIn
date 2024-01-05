import Dexie, { Table } from 'dexie'

export interface UserDB {
  id?: string
  name?: string
  avatar?: string
  token?: string
}
export interface GoogleToken {
  id?: number
  value?: string
}

export class UserDBDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  user!: Table<UserDB>
  googleToken!: Table<GoogleToken>

  constructor() {
    super('user')
    this.version(1).stores({
      user: '++id, name, avatar, token', // Primary key and indexed props
      googleToken: '++id, value'
    })
  }
}

export const userDBDexie = {
  async loginGoogle(value: string) {
    const db = new UserDBDexie()
    try {
      const data = await db.googleToken.toArray()
      if (data.length === 0) {
        return await db.googleToken.add({
          value: value
        })
      }

      return await db.googleToken.update(
        {
          id: data[data.length - 1]?.id
        },
        {
          value: value
        }
      )
    } catch (error) {
      console.log(error)
    } finally {
      db.close()
    }
  },
  async getGoogleToken() {
    const db = new UserDBDexie()
    try {
      const data = await db.googleToken.toArray()

      return data.length > 0 ? data[data.length - 1].value : ''
    } catch (error) {
      console.log('getToken \n', error)
    } finally {
      if (db.isOpen()) {
        db.close()
      }
    }
  },
  async clearToken() {
    const db = new UserDBDexie()
    try {
      await db.user.clear()
      await db.googleToken.clear()
    } catch (error) {
      console.log('clearToken', error)
    } finally {
      if (db.isOpen()) {
        db.close()
      }
    }
  },

  async saveToken(token: string) {
    const db = new UserDBDexie()
    try {
      const data = await db.user.toArray()
      if (data.length === 0) {
        return await db.user.add({
          token: token
        })
      }

      return await db.user.update(
        {
          id: data[data.length - 1]?.id
        },
        {
          token: token
        }
      )
    } catch (error) {
      console.log(error)
    } finally {
      db.close()
    }
  },

  async getToken() {
    const db = new UserDBDexie()
    try {
      const data = await db.user.toArray()

      return data.length > 0 ? data[data.length - 1].token : ''
    } catch (error) {
      console.log('getToken \n', error)
    } finally {
      if (db.isOpen()) {
        db.close()
      }
    }
  },

  async clearUser() {
    const db = new UserDBDexie()
    try {
      return await db.user.clear()
    } catch (error) {
      console.log('clear User', error)
    } finally {
      db.close()
    }
  },

  async saveUser(user: UserDB) {
    const db = new UserDBDexie()
    try {
      const data = await db.user.toArray()
      if (data.length !== 0) {
        await db.user.clear()
      }

      return await db.user.add(user)
    } catch (error) {
      console.log(error)
    } finally {
      db.close()
    }
  },

  async getUser() {
    const db = new UserDBDexie()
    try {
      const data = await db.user.toArray()

      return data.length > 0 ? data[data.length - 1] : null
    } catch (error) {
      console.log(error)
    } finally {
      if (db.isOpen()) {
        db.close()
      }
    }
  }
}
