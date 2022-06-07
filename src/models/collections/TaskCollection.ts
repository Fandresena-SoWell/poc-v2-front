import { PouchORM, PouchCollection } from 'pouchorm'
import { Spraypaint } from 'src/boot/spraypaint'
import { ITask } from '../interfaces/ITask'

export class TaskCollection extends PouchCollection<ITask> {
  async clear(): Promise<void> {
    await PouchORM.clearDatabase('tasks')
  }

  async upsert(
    item: ITask,
    deltaFunc?: (existing: ITask) => ITask
  ): Promise<ITask> {
    const task = await super.upsert(item, deltaFunc)
    if (task && !item._rev) {
      console.log('upsert item', task)
      // TODO: execute task to API with Spraypaint
      await Spraypaint.processQueue()
    }
    return task
  }
}
