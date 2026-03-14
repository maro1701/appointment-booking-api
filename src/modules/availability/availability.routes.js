import express from 'express';
import protect from '../../middlewares/auth.middleware.js';
import {createAvailability,checkAvailability,findAvailability} from './availability.controller.js';
import {requireRole} from '../../middlewares/role.middleware.js';

const router = express.Router();

router.post('/create',protect,requireRole('provider'),createAvailability);

router.get('/get',checkAvailability);

router.get('/:id/get',findAvailability);

export default router;