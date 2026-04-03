import {
  fetchAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '#controllers/user.controller.js';
import { isAuthenticated, requiredRole } from '#middleware/user.middleware.js';
import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/', isAuthenticated, fetchAllUsers);
userRoutes.get('/:id', isAuthenticated, getUserById);
userRoutes.put('/:id', isAuthenticated, updateUser);
userRoutes.delete(
  '/:id',
  isAuthenticated,
  requiredRole(['admin', 'super_admin']),
  deleteUser
);

export default userRoutes;
