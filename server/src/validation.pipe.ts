
import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { ServerException } from './utils/exception';
import { type } from 'os';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
        const errorsMessage = errors.map(error => ({
            [error.property]: Object.values(error.constraints).join(", ")
        }))
        throw new ServerException({
          ok: false,
          message: errorsMessage,
          status: HttpStatus.BAD_REQUEST,
          type: "validation"
        })
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}