import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { UserCreateDto } from '../dto/user-create.dto';
import { SignInDto } from '../dto/sign-in.dto';
import { UserEditDto } from '../dto/user-edit.dto';
import { UserService } from '../_services/user.service';
import { AccessTokenService } from '../_services/access-token.service';
import * as bcrypt from 'bcryptjs';

@Controller()
export class AccessTokenController {
  constructor(
    private userService: UserService,
    private accessTokenService: AccessTokenService,
  ) {}

  @MessagePattern('access-token-verify')
  public async verify(data) {
    const accessToken = await this.accessTokenService.findOne({_id: data.token});
    if (accessToken) {
      const user = await this.userService.findOne({_id: accessToken.user});
      return user;
    }
  }
}