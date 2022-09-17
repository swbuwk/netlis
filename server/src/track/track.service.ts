import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FilesService } from 'src/files/files.service';
import * as uuid from "uuid"
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from './models/track.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './models/comment.model';
import { Album } from 'src/albums/albums.model';
import { User } from 'src/users/users.model';
import { AlbumTrack } from 'src/albums/album-track.model';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ServerException } from 'src/utils/exception';
import { where } from 'sequelize/types';
import { Op } from 'sequelize';

@Injectable()
export class TrackService {

    constructor(@InjectModel(Comment) private commentRepository: typeof Comment,
                @InjectModel(Track) private trackRepositoy: typeof Track,
                @InjectModel(AlbumTrack) private albumTrackRepository: typeof AlbumTrack,
                @InjectModel(Album) private albumsRepository: typeof Album,
                private filesService: FilesService) {}

    async createTrack(dto: CreateTrackDto, files, user): Promise<Track> {        
        const album = await this.albumsRepository.findByPk(dto.originalAlbumId)
        if (album.authorId !== user.id) {
            throw new ServerException({
                ok: false,
                message: "You cannot add a track to this album",
                status: HttpStatus.BAD_REQUEST,
                type: "album"
            })
        }

        if (!files?.audio) {
            throw new ServerException({
                ok: false,
                message: "Error while uploading audio",
                status: HttpStatus.BAD_REQUEST,
                type: "audio"
            })
        }
        const audio = await this.filesService.uploadAudio(files.audio[0])

        let photo
        if (files.photo) {
            photo = await this.filesService.uploadImage(files.photo[0])
        }

        const verified = user.roles.some(role => role.name = "ARTIST")

        const id = uuid.v4()
        await this.trackRepositoy.create({
            id,
            ...dto,
            audio,
            photo,
            uploaderId: user.id,
            verified,
        }, {include: {all: true}})
        await this.albumTrackRepository.create({albumId: dto.originalAlbumId, trackId: id})
        return await this.getOneTrack(id)
    }

    async uploadTrackPhoto(trackId, image, userId) {
        if (!image) {
            throw new HttpException("Error while uploading photo", HttpStatus.BAD_REQUEST)
        }
        const track = await this.getOneTrack(trackId)
        if (track.uploaderId !== userId) {
            throw new HttpException("You cannot edit this track", HttpStatus.BAD_REQUEST)
        }
        const photo = await this.filesService.uploadImage(image)
        track.photo = photo
        await track.save()
        return track
    }

    async updateTrackInfo(trackId, dto: UpdateTrackDto, userId) {
        const track = await this.getOneTrack(trackId)
        if (track.uploaderId !== userId) {
            throw new HttpException("You cannot edit this track", HttpStatus.BAD_REQUEST)
        }
        track.name = dto.name
        track.text = dto.text
        await track.save()
        return track
    }

    async addCommentToTrack(dto: CreateCommentDto, trackId: string, authorId: string) {
        const comment = await this.commentRepository.create({
            ...dto,
            trackId,
            authorId
        })
        return comment
    }
    
    async getTrackComments(trackId: string) {
        const comments = await this.commentRepository.findAll({where: {trackId}})
        return comments
    }

    async getAllTracks(userId) {
        const tracks = await this.trackRepositoy.findAll({include: [
            {
                model: Album,
                where: {
                    [Op.or]: {
                        private: false,
                        [Op.and]: {
                            private: true,
                            authorId: userId
                        }
                    }
                },
            },
            {
                model: User,
                attributes: {exclude: ["password", "email"]},
            }
        ]})
        return tracks
    }



    async getOneTrack(id: string) {
        let track = await this.trackRepositoy.findByPk(id, {include: [
            {
                model: Album,
                as: "albums",
                attributes: {exclude: ["authorId"]}
            },
            {
                model: Comment,
                attributes: {exclude: ["authorId", "trackId"]}
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ], attributes: {exclude: ["uploaderId", "albumId"]}})
        return track
    }

    async deleteTrack(id: string, userId: string) {
        const track = await this.getOneTrack(id)
        if (track.uploaderId !== userId) {
            throw new HttpException("You cannot delete this track", HttpStatus.BAD_REQUEST)
        }
        let deleted: number = await this.trackRepositoy.destroy({where: {id}})
        return {deleted}
    }

}
