import logger from '#config/logger.js';
import { getAllUsers } from '#services/user.service.js';

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
