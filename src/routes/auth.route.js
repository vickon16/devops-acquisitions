import express from 'express';
import { signin, signout, signup } from '#controllers/auth.controller.js';

const authRoutes = express.Router();

authRoutes.post('/sign-up', signup);

authRoutes.post('/sign-in', signin);

authRoutes.post('/sign-out', signout);

export default authRoutes;
