import express from 'express';
import { SubscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';

const router = express.Router();

// Create checkout session - requires authentication
router.post('/create-checkout', auth(), SubscriptionController.createCheckoutSession);

// Verify payment after Stripe redirect - requires authentication
router.post('/verify-payment', auth(), SubscriptionController.verifyPayment);

// Get subscription status - requires authentication
router.get('/status', auth(), SubscriptionController.getSubscriptionStatus);

// Get premium price info - public endpoint
router.get('/price', SubscriptionController.getPremiumPriceInfo);

// Get all subscriptions - Super Admin only
router.get('/all', auth(ENUM_USER_ROLE.SUPER_ADMIN), SubscriptionController.getAllSubscriptions);

export const SubscriptionRoutes = router;



