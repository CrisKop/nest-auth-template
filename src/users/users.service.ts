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
      role: 'user', // Store the role
    });
    return user.save();
  }

  findAll() {
    return this.userModel.find().exec(); // Return all users from the database
  }

  findOne(id: number) {
    return this.userModel.findById(id).exec(); // Find a user by ID
  }

  findByUsername(username: string) {
    return this.userModel.findOne({ username }).exec(); // Find a user by username
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true }) // Update a user by ID and return the updated user
      .exec();
  }

  remove(id: number) {
    return this.userModel.findByIdAndDelete(id).exec(); // Remove a user by ID
  }

  async validatePassword(
    passwordString: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordString, hashedPassword);
  }
}
