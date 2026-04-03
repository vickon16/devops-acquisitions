import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';

export const getAllUsers = async () => {
  try {
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users);
  } catch (error) {
    logger.error('Error fetching users', error);
    throw error;
  }
};

export const getUserById = async () => {
  try {
  } catch (error) {
    logger.error('Error fetching user by ID', error);
    throw error;
  }
};

export const createUser = async () => {
  try {
  } catch (error) {
    logger.error('Error creating user', error);
    throw error;
  }
};

export const updateUser = async () => {
  try {
  } catch (error) {
    logger.error('Error updating user', error);
    throw error;
  }
};

export const deleteUser = async () => {
  try {
  } catch (error) {
    logger.error('Error deleting user', error);
    throw error;
  }
};
