import { Request, Response } from 'express';
import { PaymentService } from './payment.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.createPayment(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const getPayments = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.getPayments(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    data: result,
  });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.updatePaymentStatus(req.params.id, req.body.status);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment status updated successfully',
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  getPayments,
  updatePaymentStatus,
};
