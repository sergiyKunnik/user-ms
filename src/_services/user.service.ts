import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from '../_interfaces/user.interface';
import { UserCreateDto } from '../dto/user-create.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly UserModel: Model<IUser>,
  ) {}

  public async create(data: UserCreateDto): Promise<IUser> {
    const user = await this.UserModel.create({
      _id: Types.ObjectId(),
      passwordHash: await bcrypt.hashSync(data.password),
      email: data.password,
    });
    return user;
  }

  public async changePassword({query, newPassword}: {query: any, newPassword: string}): Promise<IUser> {
    const user = await this.UserModel.findOne(query);
    user.passwordHash = await bcrypt.hashSync(newPassword);
    await user.save();
    return user;
  }

  public async updateOne({query, dataToUpdate}: {query: any, dataToUpdate: any}): Promise<IUser>  {
    return await this.UserModel.findOneAndUpdate(query, dataToUpdate, { new: true });
  }

  public async find(query: any): Promise<IUser[]>  {
    return await this.UserModel.find(query);
  }

  public async findOne(query: any): Promise<IUser> {
    return await this.UserModel.findOne(query);
  }

  // public async addUserToChat({chatId, users}: {
  //   users: string[],
  //   chatId: string,
  // }) {
  //   const chat = await this.ChatModel.findById(chatId);
  //   chat.users.push(...users);
  //   await chat.save();
  //   return await this.ChatModel.findById(chatId);
  // }

}
