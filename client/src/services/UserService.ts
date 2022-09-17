import { AxiosError } from "axios";
import api from "../axios";
import { ServerException } from "../models/ServerException";
import { User } from "../models/User";

export class UserService {
    static async getMe() {
        return await api.get<User>("users/me").then((res) => res.data)
    }

    static async updateInfo(body) {      
        return await api.post<User>("users/update", body)
    }

    static async uploadPhoto(photo) {
        if (!photo.type || !photo.type.startsWith("image")) return
        const formData = new FormData()
        formData.append("photo", photo)
        return await api.post<User>("users/photo", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
        })
    }

    static async updateAll(body, photo) {
        await this.uploadPhoto(photo)
        await this.updateInfo(body)
    }

    static async delete(userId) {
        api.delete("users", {
            params: {
                user_id: userId
            }
        })
    }
}