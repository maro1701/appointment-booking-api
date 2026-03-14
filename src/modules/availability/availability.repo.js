import {pool} from '../../config/db.js';

export async function createAvailability(providerId,startTime,endTime){
       const result = await pool.query(`INSERT INTO availability(provider_id,start_time,end_time,is_booked) VALUES($1,$2,$3,false) RETURNING *`,[providerId,startTime,endTime,]);
      return result.rows[0];
   } 


export async function checkAvailability(){
      const result = await pool.query(`SELECT * FROM availability`);
      return result.rows;
}

export async function findAvailability(id){
   const result = await pool.query(`SELECT * FROM availability WHERE id = $1`,[id]);
   return result.rows[0]
}

export async function markSlotAsBooked(id){
   await pool.query(`UPDATE availability SET is_booked = true WHERE id = $1`,[id]);
}