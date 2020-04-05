import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ExpenseResource {
  @IsNotEmpty({ message: 'Reason was not provided!' })
  reason: any;

  @IsNotEmpty({ message: 'Amount was not provided!' })
  @IsNumber({}, { message: 'Not valid expense amount!' })
  @IsPositive({ message: 'Not valid expense amount!' })
  amount: number;

  @IsNotEmpty({ message: 'User was not provided!' })
  person: any;
}
