import { defineStore } from 'pinia'

import { tasksScheduler } from 'src/boot/cron'
import { todoCollection, userCollection } from 'src/boot/pouchorm'
import { SessionStorage, Loading } from 'quasar'

import { Promise } from 'bluebird'

import { ITask } from 'src/models/interfaces/ITask'
import { IUser } from 'src/models/interfaces/IUser'
import { SPUser } from 'src/models/spraypaint'
import { ITodoItem } from 'src/models/interfaces/ITodoItem'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      _id: '',
      name: '',
      tasks: [] as ITask[],
    }
  },
  getters: {
    getUser: ({ _id, name }) => {
      return {
        _id,
        name,
      }
    },
    getTasks: (state) => {
      return state.tasks
    },
  },
  actions: {
    async login(name: string) {
      if (!name) return Promise.resolve()

      Loading.show()

      let result
      try {
        result = await SPUser.where({ name }).includes('todos').first()
      } catch (err) {
        console.log('error login', err)
        // TODO: remove mock login
        result = {
          data: {
            id: '1',
            name,
            todos: [
              {
                id: '1',
                label: 'Todo 1',
                state: 'pending',
              },
              {
                id: '2',
                label: 'Todo 2',
                state: 'pending',
              },
            ] as ITodoItem[],
          },
        }
      }

      if (result?.data) {
        const remoteUser = result.data
        await userCollection.clear()
        await todoCollection.clear()

        const localUser = await userCollection.upsert({ name: remoteUser.name })
        await todoCollection.bulkUpsert(
          remoteUser.todos.map((todo) => {
            return {
              id: todo.id,
              label: todo.label,
              state: todo.state,
              user: localUser._id,
            }
          })
        )
      }

      userCollection
        .findOne({ name })
        .then((storedUser: IUser | null) => {
          console.log('_login storedUser', {
            name,
            storedUser,
          })
          if (storedUser?._id) {
            this.setUser({
              _id: storedUser._id,
              name: storedUser.name,
            })
            SessionStorage.set('user', storedUser.name)
            tasksScheduler.start()
          } else {
            console.log(`username ${name} cannot be found in local db`)
          }
        })
        .catch((err) => {
          console.error(`error searching ${name} in local db`, err)
        })
        .finally(() => {
          Loading.hide()
        })
    },
    setUser(user: IUser) {
      this._id = user._id || ''
      this.name = user.name
    },
    pushTask(task: ITask) {
      this.tasks = [...this.tasks, task]
    },
    removeTask(_id: string) {
      this.tasks = this.tasks.filter((t) => {
        return t._id !== _id
      })
    },
  },
})
