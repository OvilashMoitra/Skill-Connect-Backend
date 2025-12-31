import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  taskId: string;
  milestoneId?: string;
  payerId: string;
  payeeId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    milestoneId: { type: Schema.Types.ObjectId, ref: 'Project.milestones' }, // Optional link to milestone
    payerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    payeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema);
