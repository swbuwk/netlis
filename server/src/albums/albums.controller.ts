import { Body, Controller, Delete, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/auth/access.guard';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Roles("USER")
@UseGuards(RolesGuard)
@Controller('albums')
export class AlbumsController {

    constructor(private albumsService: AlbumsService) {}

    @Post()
    @UseInterceptors(FileInterceptor("photo"))
    createAlbum(@Body() dto: CreateAlbumDto,
        @Req() req,
        @UploadedFile() photo: Express.Multer.File) {
        return this.albumsService.createAlbum(dto, req.user.id, photo)
    }

    @Get()
    getAllAlbums(
        @Req() req,
        @Query("user_id") userId 
    ) {
        if (userId) {
            return this.albumsService.getUserAlbums(userId, req.user.id)
        }
        return this.albumsService.getAllAlbums(req.user.id)
    }

    @Get("/:id")
    getOneAlbum(@Param("id") albumId,
                @Req() req) {
        return this.albumsService.getOneAlbumWithPrivateControl(albumId, req.user.id)
    }

    @Post("/update")
    updateAlbumInfo(@Query("album_id") albumId,
            @Req() req,
            @Body() dto: CreateAlbumDto) {
        return this.albumsService.updateAlbumInfo(albumId, dto, req.user.id)
    }

    @Post("/photo")
    @UseInterceptors(FileInterceptor("photo"))
    updloadAlbumPhoto(@Query("album_id") albumId,
                @Req() req,
                @UploadedFile() photo: Express.Multer.File
            ) {
        return this.albumsService.uploadAlbumPhoto(albumId, photo, req.user.id)
    }

    @Delete()
    deleteAlbum(
        @Req() req,
        @Query("album_id") albumId) {
        return this.albumsService.deleteAlbum(albumId, req.user.id)
    }

    @Post("/tracks")
    addTrackToAlbum(
        @Query("album_id") albumId,
        @Query("track_id") trackId,
        @Req() req,
        ) {
        return this.albumsService.addTrackToAlbum(albumId, trackId, req.user.id)
    }

    @Delete("/tracks")
    deleteTrackFromAlbum(
        @Req() req,
        @Query("album_id") albumId,
        @Query("track_id") trackId,
        ) {
        return this.albumsService.deleteTrackFromAlbum(albumId, trackId, req.user.id)
    }

    @Get("/tracks")
    getAlbumTracks(@Param("id") id) {
        return this.albumsService.getAlbumTracks(id)
    }
}
