import { Types } from 'mongoose';
import { NotFoundError, ServiceError } from '../../utils/errors';
import User, { UserType } from './User';




class UserRepository {
  async createUser(UserData: UserType) {
    try {
      const newUser = new User(UserData);
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error: any) {
      throw new ServiceError(`Error creating User: ${error.message}`);
    }
  }

  async updateUser(UserId: string, updatedData: Partial<UserType>) {
    try {
      const updatedUser = await User.findByIdAndUpdate(UserId, updatedData, { new: true });
      if (!updatedUser) {
        throw new NotFoundError(`User with id ${UserId} not found`);
      }
      return updatedUser;
    } catch (error: any) {
      throw new ServiceError(`Error updating User: ${error.message}`);
    }
  }

  async getAllUsers() {
    try {
      const allUsers = await User.find();
      return allUsers;
    } catch (error: any) {
      throw new ServiceError(`Error getting all Users: ${error.message}`);
    }
  }

  async getUserById(UserId: Types.ObjectId | undefined) {
    try {
      const data = await User.findById(UserId);
      if (!data) {
        throw new NotFoundError(`User with id ${UserId} not found`);
      }
      return data;
    } catch (error: any) {
      throw new ServiceError(`Error getting User by id: ${error.message}`);
    }
  }

  async getByEmail(email: string) {
    try {
      const data = await User.findOne({email}).lean();
      if (!data) {
        throw new NotFoundError(`User not found`);
      }
      return data;
    } catch (error: any) {
      throw new ServiceError(`Error getting User by id: ${error.message}`);
    }
  }
}

export default new UserRepository();
