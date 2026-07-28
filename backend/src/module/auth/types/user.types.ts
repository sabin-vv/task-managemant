import { type Document } from 'mongoose'

export interface IUser extends Document {
    name: string
    email: string
    password: string
    comparePassword(candidate: string): Promise<boolean>
}
