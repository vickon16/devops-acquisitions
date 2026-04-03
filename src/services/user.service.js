import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

const baseUserObject = {
  id: users.id,
  name: users.name,
  email: users.email,
  role: users.role,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export const getAllUsers = async () => {
  try {
    return await db.select(baseUserObject).from(users);
  } catch (error) {
    logger.error('Error fetching users', error);
    throw error;
  }
};

export const getUserById = async id => {
  try {
    const userList = await db
      .select(baseUserObject)
      .from(users)
      .where(eq(users.id, id));

    return userList[0] || null;
  } catch (error) {
    logger.error(`Error fetching user by ID ${id}`, error);
    throw error;
  }
};

export const updateUser = async (id, updates) => {
  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const { ...updatedFields } = updates;
    updatedFields.updatedAt = new Date();

    const updatedUserList = await db
      .update(users)
      .set(updatedFields)
      .where(eq(users.id, id))
      .returning(baseUserObject);

    return updatedUserList[0];
  } catch (error) {
    logger.error(`Error updating user with ID ${id}`, error);
    throw error;
  }
};

export const deleteUser = async id => {
  try {
    const existingUser = await getUserById(id);
    if (!existingUser) {
      throw new Error(`User with ID ${id} not found`);
    }

    const deletedUserList = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return deletedUserList[0];
  } catch (error) {
    logger.error(`Error deleting user with ID ${id}`, error);
    throw error;
  }
};
