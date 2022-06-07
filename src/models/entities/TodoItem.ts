import { User } from './User'

export interface TodoItem {
  _id: number
  label: string
  state: 'done' | 'pending' | 'canceled'
  user?: User | number
}
