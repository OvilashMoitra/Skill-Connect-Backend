import express from 'express';
import { PaymentController } from './payment.controller';

const router = express.Router();

router.post('/', PaymentController.createPayment);
router.get('/', PaymentController.getPayments);
router.patch('/:id', PaymentController.updatePaymentStatus);

export const PaymentRoutes = router;
