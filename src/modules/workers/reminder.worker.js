
import { Worker } from 'bullmq';
import { redisConnection } from '../../config/redis.js';
import { sendReminderEmail } from '../utils/email.js';
import { pool } from '../../config/db.js';

const worker = new Worker('reminders', async (job) => {
  const { clientEmail, startTime, bookingId } = job.data;

  console.log(`Sending reminder for booking ${bookingId}`);

  await sendReminderEmail(clientEmail, startTime);

  await pool.query(
    `UPDATE bookings SET reminder_sent = true WHERE id = $1`,
    [bookingId]
  );

  console.log(`Reminder sent for booking ${bookingId}`);

}, { connection: redisConnection });

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

export default worker;