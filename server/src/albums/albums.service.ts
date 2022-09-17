import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Album } from './albums.model';
import * as uuid from "uuid"
import { CreateAlbumDto } from './dto/create-album.dto';
import { FilesService } from 'src/files/files.service';
import { Track } from 'src/track/models/track.model';
import { AlbumTrack } from './album-track.model';
import { User } from 'src/users/users.model';
import { ServerException } from 'src/utils/exception';
import { Op } from 'sequelize';

@Injectable()
export class AlbumsService {
    constructor(
        @InjectModel(Album) private albumsRepository: typeof Album,
        @InjectModel(AlbumTrack) private albumTracksReposiroty: typeof AlbumTrack,
        @InjectModel(Track) private trackRepositoy: typeof Track,
        private filesService: FilesService
    ){}

    async createAlbum(dto: CreateAlbumDto, userId: string, image: Express.Multer.File, isMain = false): Promise<Album>{
        let photo
        if (image) {
            photo = await this.filesService.uploadImage(image)
        }

        const id = uuid.v4()
        await this.albumsRepository.create({
            id,
            ...dto,
            photo,
            authorId: userId,
            isMain
        })
        
        return await this.getOneAlbum(id)
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

    async getAllAlbums(userId): Promise<Album[]> {
        const albums = await this.albumsRepository.findAll({
            where: {[Op.or]: {private: false, authorId: userId}},
            include: [
            {
                model: Track,
                attributes: {exclude: [ "AlbumTrack"]},
                include: [
                    {
                        model: User
                    }
                ]
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ], attributes: {exclude: ["authorId"]}})
        return albums
    }

    async getUserAlbums(userId, requsetedUserId): Promise<Album[]> {
        const albums = await this.albumsRepository.findAll({
            where: {[Op.and]: {
                authorId: userId,
                [Op.or]: {private: false, authorId: requsetedUserId}}
            },
            include: [
            {
                model: Track,
                attributes: {exclude: [ "AlbumTrack"]},
                include: [
                    {
                        model: User
                    }
                ]
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ], attributes: {exclude: ["authorId"]}})
        return albums
    }

    async getOneAlbum(albumId): Promise<Album> {
        if (!albumId) return
        const album = await this.albumsRepository.findByPk(albumId, {include: [
            {
                model: Track,
                attributes: {exclude: [ "AlbumTrack"]},
                include: [
                    {
                        model: User,
                        attributes: {exclude: ["password"]}
                    }
                ]
            },
            {
                model: User,
                attributes: {exclude: ["password"]}
            }
        ]})
        return album
    }

    async getOneAlbumWithPrivateControl(albumId, userId): Promise<Album> {
        const album = await this.getOneAlbum(albumId)
        if (album.private && userId !== album.authorId) {
            throw new ServerException({
                ok: false,
                type: "album",
                message: "This album is private",
                status: HttpStatus.BAD_REQUEST
            })
        }
        return album
    }

    async deleteAlbum(albumId, userId) {
        const album = await this.getOneAlbum(albumId)
        if (album.authorId !== userId) {
            throw new HttpException("You cannot delete this album", HttpStatus.BAD_REQUEST)
        }
        await this.trackRepositoy.destroy({where: {originalAlbumId: albumId}})
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
