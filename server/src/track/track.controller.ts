import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { TrackService } from './track.service';
import { RolesGuard } from 'src/auth/access.guard';
import { Roles } from 'src/roles/roles.decorator';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Roles("USER")
@UseGuards(RolesGuard)
@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post("/upload")
  @UseInterceptors(FileFieldsInterceptor([
    {name: "photo", maxCount: 1},
    {name: "audio", maxCount: 1}
  ]))
  createTrack(@Body() dto: CreateTrackDto,
        @Req() req,
        @UploadedFiles() files: {photo: Express.Multer.File[],
                                audio: Express.Multer.File[]}) {
    return this.trackService.createTrack(dto, files, req.user)
  }

  @Post("/upload/photo")
  @UseInterceptors(FileInterceptor("photo"))
  uploadTrackPhoto(
        @Query("track_id") trackId,
        @Req() req,
        @UploadedFile() photo: Express.Multer.File[],
        ) {
    return this.trackService.uploadTrackPhoto(trackId, photo, req.user)
  }

  @Patch()
  @UseInterceptors(FileInterceptor("photo"))
  updateTrackInfo(
        @Query("track_id") trackId,
        @Req() req,
        @Body() dto: UpdateTrackDto
        ) {
    return this.trackService.updateTrackInfo(trackId, dto, req.user.id)
  }

  @Post("/comments")
  addCommentToTrack(@Body() dto: CreateCommentDto,
            @Query("track_id") trackId,
            @Req() req) {
    return this.trackService.addCommentToTrack(dto, trackId, req.user.id)
  }

  @Get("/comments")
  getTrackComments(@Query("track_id") trackId) {
    return this.trackService.getTrackComments(trackId)
  }

  @Patch("/comments")
  updateTrackComment(
    @Body() dto: CreateCommentDto,
    @Query("comment_id") commentId,
    @Req() req
  ) {
    return this.trackService.updateTrackComment(dto ,commentId, req.user.id)
  }
  
  @Delete("/comments")
  deleteCommentFromTrack(
    @Query("comment_id") commentId,
    @Req() req
  ) {
    return this.trackService.deleteCommentFromTrack(commentId, req.user.id)
  }

  @Get()
  getAllTracks(
    @Req() req,
    @Query("s") search
  ) {
    if (search) {
      return this.trackService.searchTracks(search, true, req.user.id)
    }
    return this.trackService.getAllTracks(req.user.id)
  }

  @Get("/:id")
  getOneTrack(
    @Param("id") trackId,
    @Req() req) {
    return this.trackService.getOneTrack(trackId, req.user.id)
  }

  @Delete("/delete")
  deleteTrack(@Query("track_id") trackId,
        @Req() req) {
    return this.trackService.deleteTrack(trackId, req.user.id)
  }
}
