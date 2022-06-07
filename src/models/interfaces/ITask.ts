import { IModel } from 'pouchorm'

export interface ITask extends IModel {
  type: 'edit' | 'create' | 'delete'
  state: 'pending' | 'processing' | 'error'
  payload: {
    _id?: string
    state?: 'pending' | 'done' | 'canceled'
    label?: string
  }
}
