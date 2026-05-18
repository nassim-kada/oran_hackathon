import mongoose, { Schema, Document, Model, Types } from 'mongoose'

export interface IRedemption extends Document {
  userId: Types.ObjectId
  rewardName: string
  pointsCost: number
  redeemedAt: Date
}

const RedemptionSchema = new Schema<IRedemption>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rewardName: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

const Redemption: Model<IRedemption> =
  mongoose.models.Redemption ?? mongoose.model<IRedemption>('Redemption', RedemptionSchema)

export default Redemption
