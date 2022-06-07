import { PouchORM, PouchCollection } from 'pouchorm'
import { IUser } from '../interfaces/IUser'

export class UserCollection extends PouchCollection<IUser> {
  async beforeInit(): Promise<void> {
    await this.addIndex(['name'])
  }

  async clear(): Promise<void> {
    await PouchORM.clearDatabase('users')
  }
}
