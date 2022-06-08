import { PouchORM, PouchCollection } from 'pouchorm'
import { tasksScheduler } from 'src/boot/cron'
import { ITask } from '../interfaces/ITask'

export class TaskCollection extends PouchCollection<ITask> {
  async clear(): Promise<void> {
    await PouchORM.clearDatabase('tasks')
  }

  async upsert(
    task: ITask,
    deltaFunc?: (existing: ITask) => ITask
  ): Promise<ITask> {
    const upsertedTask = await super.upsert(task, deltaFunc)
    if (upsertedTask && !task._rev) {
      try {
        console.log('upsert task', task)
        // TODO: execute task to API with the tasksScheduler
        tasksScheduler.start()
      } catch {
        console.log('tasksScheduler already started')
      }
    }
    return task
  }
}
