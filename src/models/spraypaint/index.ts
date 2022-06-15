import { Model, Attr, HasMany, BelongsTo, SpraypaintBase } from 'spraypaint'
import { ITodoItem } from '../interfaces/ITodoItem'
import { IUser } from '../interfaces/IUser'

@Model()
export class ApplicationRecord extends SpraypaintBase {
  static baseUrl = 'http://localhost:3000/'
  static apiNamespace = 'api/v1'

  static generateAuthHeader(token: string) {
    return `Bearer ${token}`
  }
}

@Model()
export class SPTodoItem extends ApplicationRecord implements ITodoItem {
  static jsonapiType = 'todos'
  @Attr()
  label!: string
  @Attr
  state!: 'pending' | 'done' | 'canceled'
  @BelongsTo()
  user!: SPUser
}

@Model()
export class SPUser extends ApplicationRecord implements IUser {
  static jsonapiType = 'users'
  @Attr()
  name!: string
  @HasMany()
  todos!: SPTodoItem[]
}
