import Stripe from 'stripe';
import config from '../../../config';
import { Subscription } from './subscription.model';
import { Auth } from '../auth/auth.model';
import ApiError from '../../../errors/ApiError';
import httpStatus from 'http-status';

// Initialize Stripe only if API key is provided
const getStripe = (): Stripe => {
  if (!config.stripe_secret_key) {
    throw new ApiError(httpStatus.SERVICE_UNAVAILABLE, 'Stripe is not configured. Please set STRIPE_SECRET in your .env file.');
  }
  return new Stripe(config.stripe_secret_key as string);
};

// Premium subscription price in cents (e.g., $49.99 = 4999 cents)
const PREMIUM_PRICE_CENTS = 4999;
const PREMIUM_PRICE_DISPLAY = '$49.99';
const SUBSCRIPTION_DURATION_DAYS = 365; // 1 year

const createCheckoutSession = async (
  userId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ sessionId: string; url: string }> => {
  // Check if user exists
  const user = await Auth.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if already premium
  if (user.paid) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User is already a premium member');
  }

  // Create Stripe Checkout session for 1-year subscription payment
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Premium Subscription (1 Year)',
            description: 'Unlock unlimited projects and premium features for 1 year',
          },
          unit_amount: PREMIUM_PRICE_CENTS,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: userId,
    },
    // Include session_id in success URL for verification
    success_url: `${successUrl}${successUrl.includes('?') ? '&' : '?'}session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
  });

  // Calculate expiry date (1 year from now)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SUBSCRIPTION_DURATION_DAYS);

  // Store pending subscription record
  await Subscription.create({
    userId,
    stripeSessionId: session.id,
    plan: 'premium',
    status: 'pending',
    expiresAt,
  });

  return {
    sessionId: session.id,
    url: session.url as string,
  };
};

/**
 * Verify payment by checking Stripe session status directly
 * Called when user returns from Stripe checkout
 */
const verifyPayment = async (
  sessionId: string,
  userId: string
): Promise<{ success: boolean; message: string }> => {
  // Retrieve the session from Stripe
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }

  // Verify the session belongs to this user
  if (session.metadata?.userId !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Session does not belong to this user');
  }

  // Check if payment was successful
  if (session.payment_status === 'paid') {
    // Update user's paid status
    await Auth.findByIdAndUpdate(userId, { paid: true });

    // Update subscription record
    await Subscription.findOneAndUpdate(
      { stripeSessionId: sessionId },
      {
        status: 'active',
        stripeCustomerId: session.customer as string,
        paidAt: new Date(),
      }
    );

    return {
      success: true,
      message: 'Payment verified successfully. You are now a premium member!',
    };
  } else {
    return {
      success: false,
      message: 'Payment not completed. Please try again.',
    };
  }
};

const getSubscriptionStatus = async (
  userId: string
): Promise<{ isPremium: boolean; subscription: any | null }> => {
  const user = await Auth.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const subscription = await Subscription.findOne({
    userId,
    status: 'active',
  }).sort({ createdAt: -1 });

  return {
    isPremium: user.paid || false,
    subscription: subscription || null,
  };
};

const getPremiumPriceInfo = () => {
  return {
    amount: PREMIUM_PRICE_CENTS,
    display: PREMIUM_PRICE_DISPLAY,
    currency: 'usd',
    duration: '1 Year',
    durationDays: SUBSCRIPTION_DURATION_DAYS,
  };
};

/**
 * Get all subscriptions for admin dashboard
 * Returns subscription info with user details and days remaining
 */
const getAllSubscriptions = async (): Promise<any[]> => {
  const subscriptions = await Subscription.find({ status: 'active' })
    .populate({
      path: 'userId',
      select: 'email role',
    })
    .sort({ paidAt: -1 });

  // Get profile info for each user
  const Profile = require('../profile/profile.model').Profile;
  
  const enrichedSubscriptions = await Promise.all(
    subscriptions.map(async (sub: any) => {
      const profile = await Profile.findOne({ auth: sub.userId?._id }).select('name');
      
      // Calculate days remaining
      const now = new Date();
      const expiresAt = sub.expiresAt ? new Date(sub.expiresAt) : null;
      const daysRemaining = expiresAt 
        ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
        : null;
      
      return {
        _id: sub._id,
        plan: sub.plan,
        status: sub.status,
        paidAt: sub.paidAt,
        expiresAt: sub.expiresAt,
        daysRemaining,
        amount: PREMIUM_PRICE_DISPLAY,
        stripeSessionId: sub.stripeSessionId,
        user: {
          _id: sub.userId?._id,
          email: sub.userId?.email,
          role: sub.userId?.role,
          name: profile?.name || 'Unknown',
        },
      };
    })
  );

  return enrichedSubscriptions;
};

export const SubscriptionService = {
  createCheckoutSession,
  verifyPayment,
  getSubscriptionStatus,
  getPremiumPriceInfo,
  getAllSubscriptions,
};

