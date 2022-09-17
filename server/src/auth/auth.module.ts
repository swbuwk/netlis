import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    JwtModule.register({
      secret: process.env.SECRET_KEY
    }),
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
