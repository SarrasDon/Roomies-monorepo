import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Expense } from '@roomies/expenses.contracts';

@Component({
  selector: 'roomies-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: Expense;
  @Input() reason: string;
  @Input() user: string;

  constructor() {}

  ngOnInit() {}
}
