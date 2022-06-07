import { PouchORM, PouchCollection } from 'pouchorm'
import { ITask } from '../interfaces/ITask'

export class TaskCollection extends PouchCollection<ITask> {
  async clear(): Promise<void> {
    await PouchORM.clearDatabase('tasks')
  }
}
