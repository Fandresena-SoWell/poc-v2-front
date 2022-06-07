import { PouchORM, PouchCollection } from 'pouchorm'

import { ITodoItem } from '../interfaces/ITodoItem'

export class TodoCollection extends PouchCollection<ITodoItem> {
  async beforeInit(): Promise<void> {
    await this.addIndex(['label', 'state'])
  }

  async clear(): Promise<void> {
    await PouchORM.clearDatabase('todos')
  }
}
