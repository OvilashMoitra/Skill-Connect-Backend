import { Payment, IPayment } from './payment.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

const createPayment = async (data: IPayment): Promise<IPayment> => {
  const result = await Payment.create(data);
  return result;
};

const getPayments = async (filters: any): Promise<IPayment[]> => {
  const result = await Payment.find(filters)
    .populate('payerId', 'name email')
    .populate('payeeId', 'name email')
    .populate('taskId', 'title');
  return result;
};

const updatePaymentStatus = async (id: string, status: 'pending' | 'completed' | 'failed'): Promise<IPayment | null> => {
  const payment = await Payment.findById(id);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found');
  }
  payment.status = status;
  await payment.save();
  return payment;
};

export const PaymentService = {
  createPayment,
  getPayments,
  updatePaymentStatus,
};
