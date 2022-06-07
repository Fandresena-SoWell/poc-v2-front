import { IModel } from 'pouchorm'

export interface IUser extends IModel {
  name: string
}
