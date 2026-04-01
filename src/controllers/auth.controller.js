import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { cookiesObj } from '#utils/cookies.js';
import { formatValidationError } from '#utils/format.js';
import { jwtToken } from '#utils/jwt.js';
import { signInSchema, signUpSchema } from '../validations/auth.validation.js';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.message,
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, role } = validationResult.data;

    // Auth service
    const user = await createUser(validationResult.data);

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookiesObj.setCookie(res, 'token', token);
    logger.info(`User with email ${email} and role ${role} is being created`);

    return res.status(201).json({
      message: 'User created successfully',
      user,
    });
  } catch (error) {
    logger.error('Signup error: ', error);

    if (error?.message === 'User with this email already exists') {
      return res.status(409).json({ error: error.message });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const validationResult = signInSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.message,
        details: formatValidationError(validationResult.error),
      });
    }

    const { email, password } = validationResult.data;

    const user = await authenticateUser(email, password);

    const token = jwtToken.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    cookiesObj.setCookie(res, 'token', token);
    logger.info(`User with email ${email} signed in successfully`);

    return res.status(200).json({
      message: 'User signed in successfully',
      user,
    });
  } catch (error) {
    logger.error('Signin error: ', error);

    if (
      error?.message === 'User not found' ||
      error?.message === 'Invalid credentials'
    ) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    next(error);
  }
};

export const signout = async (req, res, next) => {
  try {
    cookiesObj.clearCookie(res, 'token');
    logger.info('User signed out successfully');

    return res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    logger.error('Signout error: ', error);
    next(error);
  }
};
