import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from './albums.model';
import * as uuid from "uuid"
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilesService } from 'src/files/files.service';
import { Track } from 'src/track/models/track.model';
import { AlbumTrack } from './album-track.model';
import { User } from 'src/users/users.model';

@Injectable()
export class AlbumsService {
    constructor(
        @InjectModel(Album) private albumsRepository: typeof Album,
        @InjectModel(AlbumTrack) private albumTracksReposiroty: typeof AlbumTrack,
        private filesService: FilesService
    ){}

    async createAlbum(dto: CreateAlbumDto, userId: string, image: Express.Multer.File): Promise<Album>{
        let photo
        if (image) {
            photo = await this.filesService.uploadImage(image)
        }
        
        const album = await this.albumsRepository.create({
            id: uuid.v4(),
            ...dto,
            photo,
            authorId: userId
        })
        
        return album
    }

    async updateAlbumInfo(albumId, dto: CreateAlbumDto, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot edit this album", HttpStatus.BAD_REQUEST)
        }
        if (dto.name) album.name = dto.name
        if (dto.description) album.description = dto.description
        await album.save()
        return album
    }

    async uploadAlbumPhoto(albumId, image: Express.Multer.File, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot edit this album", HttpStatus.BAD_REQUEST)
        }

        let photo
        if (!image) {
            throw new HttpException("Error while uploading photo", HttpStatus.BAD_REQUEST)
        }
        photo = await this.filesService.uploadImage(image)

        album.photo = photo
        
        await album.save()
        return album
    }

    async getAllAlbums(): Promise<Album[]> {
        const albums = await this.albumsRepository.findAll({include: [
            {
                model: Track,
                attributes: {exclude: ["uploaderId", "AlbumTrack"]}
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ], attributes: {exclude: ["authorId"]}})
        return albums
    }

    async getOneAlbum(albumId): Promise<Album> {
        const album = await this.albumsRepository.findByPk(albumId, {include: [
            {
                model: Track,
                attributes: {exclude: ["uploaderId", "AlbumTrack"]},
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ]})
        return album
    }

    async deleteAlbum(albumId, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot delete this album", HttpStatus.BAD_REQUEST)
        }
        const deleted = await this.albumsRepository.destroy({where: {id: albumId}})
        return {deleted}
    }


    async addTrackToAlbum(albumId, trackId, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot add a track to this album", HttpStatus.BAD_REQUEST)
        }
        await this.albumTracksReposiroty.create({
            albumId,
            trackId
        })
        return await this.getOneAlbum(albumId)
    }

    async getAlbumTracks(albumId): Promise<Track[]> {
        const album = await this.albumsRepository.findByPk(albumId, {include: {all: true}})
        return album.tracks
    }

    async deleteTrackFromAlbum(albumId, trackId, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot delete a track from this album", HttpStatus.BAD_REQUEST)
        }
        const deleted = await this.albumTracksReposiroty.destroy({where: {albumId, trackId}})
        return {deleted}
    }
}
