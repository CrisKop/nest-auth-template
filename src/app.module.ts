import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as Joi from 'joi';
import { ThrottlerBehindProxyGuard } from './auth/guards/throttler-behind-proxy.guard';

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
        PUBLIC_FRONTEND_URL: Joi.string()
          .uri()
          .default('http://localhost:5101'),
        PORT: Joi.number().default(3000),
        // Rate limiting configuration
        THROTTLE_TTL: Joi.number().default(60000), // 1 minute in milliseconds
        THROTTLE_LIMIT: Joi.number().default(10), // 10 requests per minute
      }),
    }),

    // Rate limiting configuration
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            name: 'short',
            ttl: config.get<number>('THROTTLE_TTL') || 60000,
            limit: config.get<number>('THROTTLE_LIMIT') || 10,
          },
        ],
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
  providers: [
    AppService,
    // Apply rate limiting globally to all routes with custom guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerBehindProxyGuard, // Usar el guard personalizado
    },
  ],
})
export class AppModule {}
