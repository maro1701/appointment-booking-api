import express from 'express';
import protect from '../../middlewares/auth.middleware.js';
import {requireRole} from '../../middlewares/role.middleware.js';
import {createBooking,checkBooking,deleteBooking} from './bookings.controller.js';

const router = express.Router();

router.post('/create',protect,requireRole('client'),createBooking);

router.get('/:id/get',checkBooking);

router.delete('/:id',protect,requireRole('client'),deleteBooking);
export default router;