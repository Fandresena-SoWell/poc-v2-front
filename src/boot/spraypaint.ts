import { boot } from 'quasar/wrappers'
import Promise from 'bluebird'
import { tasksCollection, todoCollection } from './pouchorm'
import { tasksScheduler } from './cron'

let isRunning = false
const Spraypaint = {
  async processTasksQueue() {
    console.log('processTasksQueue')
    if (isRunning) return

    isRunning = true
    const pendingTasks = await tasksCollection.find({ state: 'pending' })

    if (pendingTasks.length === 0) {
      tasksScheduler.stop()
    }

    await Promise.each(pendingTasks, async (task) => {
      task.state = 'processing'
      task = await tasksCollection.upsert(task)

      if (task.type === 'edit') {
        if (task._id && task.payload._id && task.payload.state) {
          console.log('processing edit task', task._id)
          // TODO: send with spraypaint
          const result = await new Promise<boolean>((resolve) => {
            setTimeout(() => {
              return resolve(true)
            }, 1000)
          })

          console.log('done edit processing task', task._id)
          if (result) {
            const todo = await todoCollection.findOne({ _id: task.payload._id })
            todo.state = task.payload.state
            await todoCollection.upsert(todo)
            await tasksCollection.removeById(task._id)
          } else {
            task.state = 'error'
            await tasksCollection.upsert(task)
          }
        }
      } else {
        if (task._id && task.payload._id && task.payload.state) {
          console.log('processing default task', task._id)
          // TODO: send with spraypaint
          const result = await new Promise<boolean>((resolve) => {
            setTimeout(() => {
              return resolve(true)
            }, 1000)
          })

          console.log('done default processing task', task._id)
          if (result) {
            await tasksCollection.removeById(task._id)
          } else {
            task.state = 'error'
            await tasksCollection.upsert(task)
          }
        }
      }
    })

    isRunning = false
  },
}

export default boot(({ app }) => {
  //
})

export { Spraypaint }
