import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from 'src/files/files.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Comment } from './models/comment.model';
import { Track } from './models/track.model';
import { AlbumsModule } from 'src/albums/albums.module';
import { AlbumTrack } from 'src/albums/album-track.model';
import { Album } from 'src/albums/albums.model';

@Module({
  controllers: [TrackController],
  providers: [TrackService],
  imports: [
    SequelizeModule.forFeature([Comment, Track, AlbumTrack, Album]),
    FilesModule,
    AuthModule,
    UsersModule,
    AlbumsModule
  ]
})
export class TrackModule {}
