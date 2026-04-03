import { fetchAllUsers } from '#controllers/user.controller.js';
import express from 'express';

const userRoutes = express.Router();

userRoutes.get('/', fetchAllUsers);
userRoutes.get('/:id', (req, res) => {
  res.json({ message: 'User fetched successfully' });
});
userRoutes.put('/:id', (req, res) => {
  res.json({ message: 'User updated successfully' });
});
userRoutes.delete('/:id', (req, res) => {
  res.json({ message: 'User deleted successfully' });
});

export default userRoutes;
