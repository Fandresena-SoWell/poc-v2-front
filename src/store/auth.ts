import { defineStore } from 'pinia'
import { ITask } from 'src/models/interfaces/ITask'
import { IUser } from 'src/models/interfaces/IUser'

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
