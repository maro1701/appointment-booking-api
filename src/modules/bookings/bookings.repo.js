import {pool} from '../../config/db.js';

export async function createBookingRepo(clientId,providerId,serviceId,slotId,status,reminderSent,jobId){
   const booking = await pool.query(`INSERT INTO bookings (client_id,provider_id,service_id,slot_id,status,reminder_sent,job_id) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,[clientId,providerId,serviceId,slotId,status,reminderSent,jobId]);
   return booking.rows[0];
}

export async function checkBookingRepo(providerId){
   const booking = await pool.query(`SELECT * FROM bookings WHERE provider_id =$1 ORDER BY created_at DESC`,[providerId]);
   return booking.rows;
}

export async function updateBookingJobId(bookingId,jobId){
   await pool.query(`UPDATE bookings SET job_id =$1 WHERE id= $2`,[jobId,bookingId]);
}

export async function findBookingById(id){
   const result = await pool.query(`
      SELECT * FROM bookings WHERE id = $1`,[id]);
      return result.rows[0];
}

export async function deleteBookingRepo(id){
   await pool.query(`DELETE FROM bookings WHERE id = $1`,[id])
}

export async function unmarkSlotAsBooked(id) {
  await pool.query(
    `UPDATE availability SET is_booked = false WHERE id = $1`, [id]
  );
}