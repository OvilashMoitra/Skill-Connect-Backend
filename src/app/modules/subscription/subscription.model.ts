import mongoose, { Schema, Model } from 'mongoose';
import { ISubscription } from './subscription.interface';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    stripeSessionId: { type: String },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free',
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'cancelled', 'expired'],
      default: 'pending',
    },
    paidAt: { type: Date },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const Subscription: Model<ISubscription> = mongoose.model<ISubscription>(
  'Subscription',
  SubscriptionSchema
);
