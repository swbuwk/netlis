import { Injectable } from '@nestjs/common';
import * as fs from "fs"
import * as path from "path"
import * as uuid from "uuid"

@Injectable()
export class FilesService {
    async uploadImage(file) {
        const imgName = uuid.v4() + ".jpg"
        const imgPath = path.resolve(__dirname, "..", "static")
        await this.uploadFile(imgPath, imgName, file.buffer)
        return imgName
    }

    async uploadAudio(file) {
        const audioName = uuid.v4() + "mp3"
        const audioPath = path.resolve(__dirname, "..", "static")
        await this.uploadFile(audioPath, audioName, file.buffer)
        return audioName
    }

    async uploadFile(filePath, name, file) {
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, {recursive: true})
        }
        fs.writeFileSync(path.join(filePath, name), file)
    }
}
