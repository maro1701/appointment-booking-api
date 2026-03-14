import {Queue} from 'bullmq';
import * as bookingRepo from './bookings.repo.js';
import * as availabilityRepo from '../availability/availability.repo.js';
import * as userRepo from '../users/users.repo.js';
import { reminderQueue } from '../../config/queue.js';
import { pool } from '../../config/db.js';

export async function createBookingService(clientId, serviceId, slotId) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const slot = await availabilityRepo.findAvailability(slotId);
    if (!slot) throw new Error('Slot not found');
    if (slot.is_booked) throw new Error('Slot already booked');

    const providerId = slot.provider_id;

    const booking = await bookingRepo.createBookingRepo(
      clientId, providerId, serviceId, slotId, 'confirmed', false, null
    );

    await availabilityRepo.markSlotAsBooked(slotId);

    const user = await userRepo.findUserById(clientId);
    if (!user) throw new Error('Client not found');

    const job = await reminderQueue.add(
      'send-reminder',
      {
        clientEmail: user.email,
        startTime: slot.start_time,
        bookingId: booking.id
      },
      { delay: 5000 }
    );

    await bookingRepo.updateBookingJobId(booking.id, job.id);
    booking.job_id = job.id;

    await client.query('COMMIT');
    return booking;

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function checkBookingService(userId) {
  return bookingRepo.checkBookingRepo(userId);
}

export async function deleteBookingService(bookingId,clientId){
   const booking = await bookingRepo.findBookingById(bookingId);
   if(!booking) throw new Error(`Booking not found`);

   if(booking.client_id !== clientId){
    throw new Error(`Unauthorized - this is not your booking`)
    ;
   }
   const job = await reminderQueue.getJob(booking.job_id);
   if(job) await job.remove();

   await availabilityRepo.unMarkSlotAsBooked(booking.slot_id);

   await bookingRepo.deleteBookingRepo(bookingId);
   return {message:'booking cancelled'};
}