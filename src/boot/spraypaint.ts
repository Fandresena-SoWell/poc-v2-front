import { boot } from 'quasar/wrappers'
import Promise from 'bluebird'
import { tasksCollection, todoCollection, userCollection } from './pouchorm'
import { tasksScheduler } from './cron'
import { useAuthStore } from 'src/store/auth'
import { ITodoItem } from 'src/models/interfaces/ITodoItem'
import { SPTodoItem, SPUser } from 'src/models/spraypaint'
import { assert } from 'console'

let isRunning = false
const Spraypaint = {
  processTasksQueue: async () => {
    console.log('-------processTasksQueue not ready')
    return Promise.resolve()
  },
}

export default boot(({ app }) => {
  const authStore = useAuthStore()
  Spraypaint.processTasksQueue = async () => {
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
          try {
            const todo = await todoCollection.findOne({ _id: task.payload._id })
            if (!todo || !todo.id) {
              throw new Error(`Cannot process edit task ${task.payload._id}`)
            }

            const remoteTodo = (await SPTodoItem.find(todo.id)).data
            remoteTodo.state = task.payload.state
            const result = await remoteTodo.save()

            console.log('done edit processing task', task._id)
            console.log({ result })
            if (result) {
              todo.state = remoteTodo.state
              await todoCollection.upsert(todo)
              await tasksCollection.removeById(task._id)
              console.log('removing task', task._id)
              authStore.removeTask(task._id)
              console.log('removed task', task._id)
            } else {
              throw new Error('Error updating remote todo')
            }
          } catch (err) {
            console.error(err)
            task.state = 'error'
            await tasksCollection.upsert(task)
            authStore.removeTask(task._id)
          }
        }
      } else if (task.type === 'create') {
        if (task._id && task.payload.label && task.payload.user) {
          console.log('processing create task', task._id)

          try {
            const localUser = await userCollection.findById(task.payload.user)
            const remoteUser = (
              await SPUser.where({ name: localUser.name })
                .includes('todos')
                .first()
            )?.data
            if (!remoteUser) {
              throw `Cannot find remote user ${localUser.name}`
            }
            const newTodo = new SPTodoItem({
              label: task.payload.label,
              state: task.payload.state || 'pending',
            })

            remoteUser?.todos.push(newTodo)
            const result = await remoteUser?.save({ with: 'todos' })

            console.log('done processing create task', task._id)
            if (result) {
              const todo: ITodoItem = {
                label: newTodo.label,
                state: newTodo.state,
                user: task.payload.user,
              }
              await todoCollection.upsert(todo)

              await tasksCollection.removeById(task._id)
              console.log('removing task', task._id)
              authStore.removeTask(task._id)
              console.log('removed task', task._id)
            } else {
              throw new Error('Error creating remote todo')
            }
          } catch (err) {
            console.error(err)
            task.state = 'error'
            await tasksCollection.upsert(task)
            authStore.removeTask(task._id)
          }
        }
      } else if (task.type === 'delete') {
        if (task._id && task.payload._id) {
          console.log('processing delete task', task._id)

          try {
            const localTodo = await todoCollection.findById(task.payload._id)
            if (!localTodo || !localTodo.id) {
              throw 'Cannot find the local todo to delete'
            }

            const remoteTodo = (await SPTodoItem.find(localTodo.id)).data
            if (!remoteTodo) {
              throw `Cannot find remote todo ${localTodo.id}`
            }

            remoteTodo.isMarkedForDestruction = true
            const result = await remoteTodo.save()

            console.log('done processing delete task', task._id)
            if (result) {
              await todoCollection.removeById(task.payload._id)

              await tasksCollection.removeById(task._id)
              console.log('removing task', task._id)
              authStore.removeTask(task._id)
              console.log('removed task', task._id)
            } else {
              throw 'Cannot delete remote todo'
            }
          } catch (err) {
            console.error(err)
            task.state = 'error'
            await tasksCollection.upsert(task)
            await tasksCollection.removeById(task._id)
            authStore.removeTask(task._id)
          }
        }
      } else {
        console.log('Unsupported task type')
      }
    })

    isRunning = false
  }
})

export { Spraypaint }
