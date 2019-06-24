import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer'; 

@Injectable()
export class CreateUserValidPipe implements PipeTransform<any> {
  async transform(value, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        this.createErrorMsg(errors) || 'Validation failed',
      );
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.find(type => metatype === type);
  }

  private createErrorMsg(errors: ValidationError[]): string[] {
    const concat = (x: Array<string>, y: Array<string>) => x.concat(y);
    const msgs = errors
      .map(error =>
        Object.keys(error.constraints).map(key => error.constraints[key]),
      )
      .reduce(concat, []);
    return [...new Set(msgs)];
  }
}
