import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/user.service.js';
import {
  userIdSchema,
  updateUserSchema,
} from '../validations/user.validation.js';
import { formatValidationError } from '#utils/format.js';

export const fetchAllUsers = async (req, res, next) => {
  try {
    logger.info('Fetching all users');

    const allUsers = await getAllUsers();

    logger.info('All users fetched successfully');

    return res.status(200).json({
      message: 'All users fetched successfully',
      allUsers,
      count: allUsers.length,
    });
  } catch (error) {
    logger.error('Error fetching users: ', error);
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.message,
        details: formatValidationError(validationResult.error),
      });
    }

    const { id } = validationResult.data;
    logger.info(`Fetching user with ID ${id}`);

    const user = await getUserByIdService(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    logger.info(`User with ID ${id} fetched successfully`);

    return res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    logger.error('Error fetching user: ', error);
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const paramsValidation = userIdSchema.safeParse(req.params);
    if (!paramsValidation.success) {
      return res.status(400).json({
        error: paramsValidation.error.message,
        details: formatValidationError(paramsValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        error: bodyValidation.error.message,
        details: formatValidationError(bodyValidation.error),
      });
    }

    const targetUserId = paramsValidation.data.id;
    const updates = bodyValidation.data;

    const authUser = req.user;

    if (authUser.role !== 'admin' && authUser.id !== targetUserId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You can only update your own information' });
    }

    if (updates.role && authUser.role !== 'admin') {
      return res
        .status(403)
        .json({ error: 'Forbidden: Only admins can change roles' });
    }

    logger.info(`Updating user with ID ${targetUserId}`);

    const updatedUser = await updateUserService(targetUserId, updates);

    logger.info(`User with ID ${targetUserId} updated successfully`);

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    logger.error('Error updating user: ', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const validationResult = userIdSchema.safeParse(req.params);
    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.message,
        details: formatValidationError(validationResult.error),
      });
    }

    const targetUserId = validationResult.data.id;

    const authUser = req.user;

    if (authUser.role !== 'admin' && authUser.id !== targetUserId) {
      return res
        .status(403)
        .json({ error: 'Forbidden: You can only delete your own account' });
    }

    logger.info(`Deleting user with ID ${targetUserId}`);

    const deletedUser = await deleteUserService(targetUserId);

    logger.info(`User with ID ${targetUserId} deleted successfully`);

    return res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser,
    });
  } catch (error) {
    logger.error('Error deleting user: ', error);
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    next(error);
  }
};
