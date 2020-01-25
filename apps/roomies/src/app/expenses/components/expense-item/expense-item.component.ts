import {
  Component,
  Input,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import { Expense } from '../../../shared/models';

@Component({
  selector: 'roomies-expense-item',
  templateUrl: './expense-item.component.html',
  styleUrls: ['./expense-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpenseItemComponent implements OnInit {
  @Input() expense: Expense;

  constructor() {}

  ngOnInit() {}

  get expImgSource() {
    const reason = this.expense.reason.reason.toLowerCase();
    return `assets/icons/${reason.toLowerCase()}.svg`;
  }
}
