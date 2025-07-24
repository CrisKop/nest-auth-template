import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const hasshedPassword = await bcrypt.hash(createUserDto.password, 10); // Here you would hash the password
    const user = new this.userModel({
      username: createUserDto.username, // Store the username
      password: hasshedPassword, // Store the hashed password
      role: createUserDto.role || 'user', // Store the role, default to 'user'
    });
    return user.save();
  }

  findAll() {
    return this.userModel.find().select('-password').exec(); // Return all users from the database without passwords
  }

  findOne(id: string) {
    return this.userModel.findById(id).select('-password').exec(); // Find a user by ID without password
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec(); // Find a user by username (with password for auth)
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true }) // Update a user by ID and return the updated user
      .select('-password')
      .exec();
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec(); // Remove a user by ID
  }

  async validatePassword(
    passwordString: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordString, hashedPassword);
  }
}
