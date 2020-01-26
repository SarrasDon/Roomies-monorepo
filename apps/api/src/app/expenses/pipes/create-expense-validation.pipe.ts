import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ExpenseResource } from '../models';

@Injectable()
export class CreateExpenseValidPipe implements PipeTransform<ExpenseResource> {
  async transform(value: ExpenseResource, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    value.amount = +value.amount;
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(
        this.createErrorMsg(errors) || 'Validation failed'
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
        Object.keys(error.constraints).map(key => error.constraints[key])
      )
      .reduce(concat, []);

    return [...new Set(msgs)];
  }
}
