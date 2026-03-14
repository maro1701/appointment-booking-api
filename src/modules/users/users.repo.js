// src/modules/users/users.repo.js
import { pool } from '../../config/db.js';
import { hashPassword } from '../utils/hash.js';

export async function createUserRepo(email, password, role) {
  const hashed = await hashPassword(password);
  const result = await pool.query(
    `INSERT INTO users (email, password, role) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, role, created_at`,
    [email, hashed, role]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );
  return result.rows[0];
}

export async function findUserById(id) {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}