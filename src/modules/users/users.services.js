// src/modules/users/users.service.js
import * as userRepo from './users.repo.js';
import { signToken } from '../utils/jwt.js';
import { comparePassword } from '../utils/hash.js';

export async function createUserService(email, password, role) {
  // check if user already exists
  const existing = await userRepo.findUserByEmail(email);
  if (existing) throw new Error('User already exists');

  // create the user
  const user = await userRepo.createUserRepo(email, password, role);

  // sign token with id, email and role
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function loginUserService(email, password) {
  // find user
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new Error('User not found');

  // check password
  const match = await comparePassword(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  // sign token
  const token = signToken({ id: user.id, email: user.email, role: user.role });

  return {
    user: { id: user.id, email: user.email, role: user.role },
    token
  };
}