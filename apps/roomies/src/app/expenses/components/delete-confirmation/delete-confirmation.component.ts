import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { Expense } from '@roomies/expenses.contracts';
import { selectExpenseReasonsEntities } from '../../store/expenses.selectors';
import { deleteExpense } from '../../store/expenses.actions';

@Component({
  selector: 'roomies-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteConfirmationComponent implements OnInit {
  expenseReasons$ = this.store.pipe(select(selectExpenseReasonsEntities));

  constructor(
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public expense: Expense,
    private dialog: MatDialogRef<DeleteConfirmationComponent>
  ) {}

  ngOnInit(): void {}

  onDelete() {
    this.store.dispatch(deleteExpense({ expense: this.expense }));
    this.dialog.close();
  }

  onCancel() {
    this.dialog.close();
  }
}
