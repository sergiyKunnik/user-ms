import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateDto } from '../dto/user-create.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { UserEditDto } from '../dto/user-edit.dto';
import { UserService } from '../_services/user.service';
import { AccessTokenService } from '../_services/access-token.service';
import * as bcrypt from 'bcryptjs';

@Controller()
export class UserController {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService,
  ) {}

  @MessagePattern('user-create')
  public async createUser(data: UserCreateDto) {
    const user = await this.userService.create(data);
    const accessToken = await this.accessTokenService.create({
      data: {},
      userId: user._id.toString(),
    });
    return {
      accessToken: accessToken._id,
      user,
    };
  }
  @MessagePattern('user-update')
  public async updateUser(data: UserEditDto) {
    const user = await this.userService.updateOne({query: {_id: data.id}, dataToUpdate: data});
    return user;
  }

  @MessagePattern('user-change-password')
  public async changePassword(data: UserEditDto) {
    const { password, ...dataToUpdate} = data;
    const user = await this.userService.updateOne({query: {_id: data.id}, dataToUpdate});
    if (password) {
      await this.userService.changePassword({
        query: {
          _id: user._id,
        },
        newPassword: password,
      })
    }
    return user;
  }

  @MessagePattern('user-verify-credentials')
  public async verifyCredentials(data: SignInDto) {
    const user = await this.userService.findOne({
      email: data.email
    });
    if (user) {
      await bcrypt.compareSync(data.password, user.passwordHash);
      const accessToken = await this.accessTokenService.create({
        data: {},
        userId: user._id.toString(),
      });
      return {
        accessToken: accessToken._id,
        user,
      };
    }
  }

  @MessagePattern('user-find')
  public async find(data: any) {
    const users = await this.userService.find(data);
    return users;
  }

  @MessagePattern('user-findOne')
  public async findOne(data: any) {
    const user = await this.userService.findOne(data);
    return user;
  }
}