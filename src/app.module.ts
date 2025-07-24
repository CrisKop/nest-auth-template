import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    // ConfigModule is used to load environment variables and validate them
    // using Joi for schema validation.
    ConfigModule.forRoot({
      isGlobal: true, // hace disponible ConfigService globalmente
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
        PUBLIC_FRONTEND_URL: Joi.string().uri().default('http://localhost:5101'),
        PORT: Joi.number().default(3000),
      }),
    }),

    // MongooseModule is used to connect to MongoDB using the URI from environment variables.
    // It is configured to connect to the MongoDB database specified in the MONGODB_URI
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
