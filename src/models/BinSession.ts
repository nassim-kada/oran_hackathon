import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBinSession extends Document {
  binId: string
  userId: mongoose.Types.ObjectId | string
  active: boolean
  updatedAt: Date
}

const BinSessionSchema = new Schema<IBinSession>(
  {
    binId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const BinSession: Model<IBinSession> =
  mongoose.models.BinSession ?? mongoose.model<IBinSession>('BinSession', BinSessionSchema)

export default BinSession
