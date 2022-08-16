import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FilesModule } from 'src/files/files.module';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from 'src/roles/roles.module';
import { Role } from 'src/roles/roles.model';
import { UserRole } from 'src/roles/user-roles.model';
import { AuthModule } from 'src/auth/auth.module';
import { Track } from 'src/track/models/track.model';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Track]),
    FilesModule,
    forwardRef(() => AuthModule),
    RolesModule
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
