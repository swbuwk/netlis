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
    getAllAlbums() {
        return this.albumsService.getAllAlbums()
    }

    @Get("/:id")
    getOneAlbum(@Param("id") id) {
        return this.albumsService.getOneAlbum(id)
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
        @Req() req,
        @Query() qs) {
        return this.albumsService.addTrackToAlbum(qs.album_id, qs.track_id, req.user.id)
    }

    @Delete("/tracks")
    deleteTrackFromAlbum(
        @Req() req,
        @Query() qs) {
        return this.albumsService.deleteTrackFromAlbum(qs.album_id, qs.track_id, req.user.id)
    }

    @Get("/tracks")
    getAlbumTracks(@Param("id") id) {
        return this.albumsService.getAlbumTracks(id)
    }
}
