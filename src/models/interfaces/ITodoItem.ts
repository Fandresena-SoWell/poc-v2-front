import { IUser } from './IUser'

import { IModel } from 'pouchorm'

export interface ITodoItem extends IModel {
  label: string
  state: 'pending' | 'done' | 'canceled'
  user?: IUser | string
}
