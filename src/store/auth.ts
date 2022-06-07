import { defineStore } from 'pinia'
import { IUser } from 'src/models/interfaces/IUser'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      _id: '',
      name: '',
    }
  },
  getters: {
    user: ({ _id, name }) => {
      return {
        _id,
        name,
      }
    },
  },
  actions: {
    setUser(user: IUser) {
      this._id = user._id || ''
      this.name = user.name
    },
  },
})
