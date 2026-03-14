import express from 'express';
import userRoutes from './modules/users/users.routes.js';
import serviceRoutes from './modules/services/services.routes.js';
import availabilityRoutes from './modules/availability/availability.routes.js';
import bookingRoutes from './modules/bookings/bookings.routes.js';
import errorHandler from './modules/utils/error.js';

const app = express();

app.use(express.json());

app.use('/users',userRoutes);

app.use('/services',serviceRoutes);

app.use('/availability',availabilityRoutes);

app.use('/bookings',bookingRoutes);

app.use(errorHandler);

export default app;