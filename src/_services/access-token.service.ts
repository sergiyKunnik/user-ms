import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { IUser } from '../_interfaces/user.interface';
import { UserCreateDto } from '../dto/user-create.dto';
import * as bcrypt from 'bcryptjs';
import { IAccessToken } from '../_interfaces/access-token.interface';
import randtoken = require('rand-token');
import { ACCESS_TOKEN_CONSTS } from '../_consts/tokens.consts';
@Injectable()
export class AccessTokenService {
  constructor(
    @InjectModel('AccessToken') private readonly AccessTokenModel: Model<IAccessToken>,
  ) {}


  public async create({userId, data}: {
    userId: string,
    data?: any
  }): Promise<IAccessToken> {
    return await this.AccessTokenModel.create({
      _id: randtoken.uid(ACCESS_TOKEN_CONSTS.SIZE),
      user: userId,
      created: new Date(),
      validToDate: new Date((new Date()).getTime() + ACCESS_TOKEN_CONSTS.TTL),
    });
  }

  public async findOne(query: any): Promise<IAccessToken> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in findOne`);
    }
    const currentDate: Date = new Date();
    return await this.AccessTokenModel.findOne({
      validToDate: { $gte: currentDate },
      ...query,
    });
  }

  public async find(query: {}): Promise<IAccessToken[]> {
    const currentDate: Date = new Date();
    return await this.AccessTokenModel.find({
      validToDate: { $gte: currentDate },
      ...query,
    });
  }

  public async findAll(query: {}): Promise<IAccessToken[]> {
    return await this.AccessTokenModel.find({
      ...query,
    });
  }

  public async updateMany(query: {}, dataToUpdate: {}): Promise<any> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in updateMany`);
    }
    return await this.AccessTokenModel.updateMany(query, dataToUpdate);
  }

  public async deleteOne(query: {}): Promise<{ ok?: number, n?: number }> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteOne`);
    }
    return await this.AccessTokenModel.deleteOne(query);
  }

  public async deleteMany(query: {}): Promise<{ ok?: number, n?: number }> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in deleteMany`);
    }
    return await this.AccessTokenModel.deleteMany(query);
  }

  async findOneAndUpdate(query: {}, update: {}): Promise<IAccessToken> {
    if (!Object.keys(query).length) {
      throw new Error(`Empty query in findOneAndUpdate`);
    }
    return await this.AccessTokenModel.findOneAndUpdate(query, update, { new: true });
  }
}
