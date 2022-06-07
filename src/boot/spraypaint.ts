import { boot } from 'quasar/wrappers'
import Promise from 'bluebird'
import { delay } from 'src/utils/delay'
import { tasksCollection, todoCollection } from './pouchorm'

let isRunning = false
const Spraypaint = {
  async processQueue() {
    if (isRunning) return

    isRunning = true
    // TODO: get first element to treat
    const pendingTasks = await tasksCollection.find({ state: 'pending' })
    await Promise.each(pendingTasks, async (task) => {
      // TODO: treat task
      task.state = 'processing'
      task = await tasksCollection.upsert(task)

      // TODO: send task to API
      if (task.type === 'edit') {
        console.log('processing edit task', task._id)
        await delay(async () => {
          console.log('done edit processing task', task._id)
          if (task._id && task.payload._id && task.payload.state) {
            const todo = await todoCollection.findOne({ _id: task.payload._id })
            todo.state = task.payload.state
            await todoCollection.upsert(todo)
            await tasksCollection.removeById(task._id)
          }
        }, 500)
      } else {
        console.log('processing default task', task._id)
        await delay(async () => {
          console.log('done default processing task', task._id)
          if (task._id) {
            await tasksCollection.removeById(task._id)
          }
        }, 500)
      }
    })
    isRunning = false
  },
}

export default boot(({ app }) => {
  //
})

export { Spraypaint }
