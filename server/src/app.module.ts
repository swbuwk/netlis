import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TrackModule } from './track/track.module';
import { FilesModule } from './files/files.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model';
import { UserRole } from './roles/user-roles.model';
import { ServeStaticModule } from '@nestjs/serve-static';
import path, { join } from 'path';
import { Track } from './track/models/track.model';
import { Comment } from './track/models/comment.model';
import { AlbumsModule } from './albums/albums.module';
import { Album } from './albums/albums.model';
import { AlbumTrack } from './albums/album-track.model';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Role, UserRole, Track, Comment, Album, AlbumTrack],
      autoLoadModels: true
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'static'),

    }),
    TrackModule,
    FilesModule,
    UsersModule,
    AuthModule,
    RolesModule,
    AlbumsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
