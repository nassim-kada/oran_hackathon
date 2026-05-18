import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IUser extends Document {
  username: string
  email: string
  passwordHash: string
  points: number
  isAdmin: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    points: { type: Number, default: 0 },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const User: Model<IUser> = mongoose.models.User ?? mongoose.model<IUser>('User', UserSchema)

export default User
