import { boot } from 'quasar/wrappers'
import { PouchORM } from 'pouchorm'
import {
  UserCollection,
  TodoCollection,
  TaskCollection,
} from 'src/models/collections'

const userCollection = new UserCollection('users')
const todoCollection = new TodoCollection('todos')
const tasksCollection = new TaskCollection('tasks')

export default boot(() => {
  PouchORM.LOGGING = false
})

export { userCollection, todoCollection, tasksCollection }
