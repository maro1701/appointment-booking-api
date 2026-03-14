import {pool} from '../../config/db.js';

export async function createServiceRepo(providerId,name,duration,price){
   const result = await pool.query(`INSERT INTO services(provider_id,name,duration,price) VALUES($1,$2,$3,$4) RETURNING *`,[providerId,name,duration,price]);
   return result.rows[0];
}

export async function getServiceRepo(){
   const result = await pool.query(`SELECT * FROM services ORDER BY created_at DESC `);
   return result.rows;
}

export async function findServiceRepo(id){
   const result = await pool.query(`SELECT * FROM services WHERE id =$1`,[id]);
   return result.rows[0];
}