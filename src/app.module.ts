import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Schema } from 'mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserSchema } from './_schemas/user.schema';
import { UserService } from './_services/user.service';
import { AccessTokenSchema } from './_schemas/access-token.schema';
import { AccessTokenService } from './_services/access-token.service';
import { UserController } from './controllers/user.controller';
import { AccessTokenController } from './controllers/access-token.controller';

const SCHEMAS: Array<{ name: string, schema: Schema }> = [
  { name: 'User', schema: UserSchema },
  { name: 'AccessToken', schema: AccessTokenSchema },
];

const SERVICES = [
  UserService,
  AccessTokenService,
];

const CONTROLLERS = [
  UserController,
  AccessTokenController,
];

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `configs/${process.env.NODE_ENV ? `${process.env.NODE_ENV}` : ''}.env`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const mongodbUri = configService.get('mongodb_uri');
        const mongodbName = configService.get('mongodb_name');
        return ({
          uri: `${mongodbUri}/${mongodbName}`,
          useFindAndModify: false,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature(SCHEMAS),
  ],
  controllers: [
    ...CONTROLLERS,
  ],
  providers: [
    ...SERVICES,
  ],
})
export class AppModule {}
