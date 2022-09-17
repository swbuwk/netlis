import { HttpException } from '@nestjs/common';

export class ServerException extends HttpException {
    ok: boolean
    type: string

    constructor({ok, type, message, status}) {
        super(message, status)
        this.ok = ok,
        this.type = type
    }
}