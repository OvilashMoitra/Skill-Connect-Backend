import { Request, Response } from 'express';
import { SubscriptionService } from './subscription.service';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';

const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { successUrl, cancelUrl } = req.body;

  // Default URLs if not provided
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const success = successUrl || `${frontendUrl}/subscription?status=success`;
  const cancel = cancelUrl || `${frontendUrl}/subscription?status=cancelled`;

  const result = await SubscriptionService.createCheckoutSession(userId, success, cancel);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});

/**
 * Verify payment after user returns from Stripe checkout
 * No webhook needed - checks session status directly with Stripe API
 */
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const { sessionId } = req.body;

  if (!sessionId) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'Session ID is required',
      data: null,
    });
  }

  const result = await SubscriptionService.verifyPayment(sessionId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: result.success,
    message: result.message,
    data: result,
  });
});

const getSubscriptionStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const result = await SubscriptionService.getSubscriptionStatus(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subscription status retrieved successfully',
    data: result,
  });
});

const getPremiumPriceInfo = catchAsync(async (req: Request, res: Response) => {
  const result = SubscriptionService.getPremiumPriceInfo();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Premium price info retrieved successfully',
    data: result,
  });
});

/**
 * Get all subscriptions - Admin only
 */
const getAllSubscriptions = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscriptions();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All subscriptions retrieved successfully',
    data: result,
  });
});

export const SubscriptionController = {
  createCheckoutSession,
  verifyPayment,
  getSubscriptionStatus,
  getPremiumPriceInfo,
  getAllSubscriptions,
};


