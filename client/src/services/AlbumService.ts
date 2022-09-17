import { useToast } from "@chakra-ui/react"
import { AxiosError } from "axios"
import api from "../axios"
import { Album } from "../models/Album"
import { ServerException } from "../models/ServerException"

export class AlbumService {
    static async create(body) {
        const formData = new FormData()
        formData.append("name", body.name)
        formData.append("description", body.description)
        formData.append("private", ""+body.private)
        formData.append("photo", body.photo)
        await api.post<Album>("/albums", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
    }

    static async getAll() {
        return await api.get<Album[]>(`albums`).then(res => res.data)
    }

    static async get(albumId) {
        return await api.get<Album>(`albums/${albumId}`).then(res => res.data)
    }

    static async delete(albumId) {
        return await api.delete("albums", {
            params: {
                album_id: albumId
            }
        })
    }

    static async addTrack(trackId, albumId) {
        return await api.post(`/albums/tracks?track_id=${trackId}&album_id=${albumId}`)
    } 

    static async removeTrack(trackId, albumId) {
        return await api.delete(`/albums/tracks?track_id=${trackId}&album_id=${albumId}`)
    } 
}