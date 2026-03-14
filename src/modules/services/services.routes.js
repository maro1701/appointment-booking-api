import express from 'express';
import {createService,getService,findService} from './services.controller.js';
import {requireRole} from '../../middlewares/role.middleware.js';
import protect from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create', protect,requireRole('provider'),createService);

router.get('/get',getService);

router.get('/:id/get',findService);

export default router;