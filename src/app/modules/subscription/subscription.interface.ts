import { Types } from 'mongoose';

export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';
export type SubscriptionPlan = 'free' | 'premium';

export type ISubscription = {
  userId: Types.ObjectId;
  stripeSessionId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  paidAt?: Date;
  expiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};
