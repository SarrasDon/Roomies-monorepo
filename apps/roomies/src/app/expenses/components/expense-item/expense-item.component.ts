import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { User } from '@roomies/user.contracts';

@Component({
  selector: 'roomies-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: Expense;
  @Input() reason: ExpenseReason;
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
