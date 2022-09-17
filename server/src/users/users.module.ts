import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { FilesModule } from '../files/files.module';
import { User } from './users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { RolesModule } from '../roles/roles.module';
import { Role } from '../roles/roles.model';
import { UserRole } from '../roles/user-roles.model';
import { AuthModule } from '../auth/auth.module';
import { Track } from '../track/models/track.model';
import { AlbumsModule } from 'src/albums/albums.module';

@Module({
  providers: [UsersService],
  controllers: [UsersController],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRole, Track]),
    FilesModule,
    forwardRef(() => AuthModule),
    RolesModule,
    forwardRef(() => AlbumsModule)
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule {}
