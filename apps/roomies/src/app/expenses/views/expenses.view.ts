import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'roomies-expenses-view',
  templateUrl: './expenses.view.html',
  styleUrls: ['./expenses.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesViewComponent {
  constructor() {}
}
