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

export default boot(async () => {
  PouchORM.LOGGING = false

  // NOTE: adding dummy users
  await userCollection.clear()
  await userCollection.bulkUpsert([{ name: 'Fandresena' }, { name: 'Guest' }])

  const users = await userCollection.find()

  await todoCollection.clear()
  await todoCollection.bulkUpsert([
    { label: 'Todo Fandresena 1', state: 'pending', user: users[0]._id },
    { label: 'Todo Fandresena 2', state: 'pending', user: users[0]._id },
    { label: 'Todo Fandresena 3', state: 'done', user: users[0]._id },
    { label: 'Todo Guest 1', state: 'pending', user: users[1]._id },
    { label: 'Todo Guest 2', state: 'pending', user: users[1]._id },
  ])
})

export { userCollection, todoCollection, tasksCollection }
