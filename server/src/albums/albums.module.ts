import { forwardRef, Module } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { AlbumsController } from './albums.controller';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Album } from './albums.model';
import { FilesModule } from 'src/files/files.module';
import { AlbumTrack } from './album-track.model';
import { Track } from 'src/track/models/track.model';

@Module({
  providers: [AlbumsService],
  controllers: [AlbumsController],
  imports: [
    forwardRef(() => AuthModule),
    SequelizeModule.forFeature([Album, AlbumTrack, Track]),
    FilesModule
  ],
  exports: [
    AlbumsService
  ]
})
export class AlbumsModule {}
