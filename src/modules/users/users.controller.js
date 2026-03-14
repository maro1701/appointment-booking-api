// src/modules/users/user.controller.js
import * as userService from './users.services.js';

export async function createUser(req, res, next) {
  try {
    const { email, password, role } = req.body;
    const result = await userService.createUserService(email, password, role);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUserService(email, password);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}