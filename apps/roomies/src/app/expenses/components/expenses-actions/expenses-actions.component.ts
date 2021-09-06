import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { filter } from 'rxjs/operators';
import { getCurrentUser } from '../../../auth/store';
import { CreateExpenseConfig } from '../../../shared/interfaces';
import { storeSnapshot } from '../../../shared/utils';
import {
  createExpense,
  ExpensesState,
  selectExpenseReasons,
} from '../../store';
import { CreateExpenseDialogComponent } from '../create-expense-dialog/create-expense-dialog.component';

@Component({
  selector: 'roomies-expenses-actions',
  templateUrl: './expenses-actions.component.html',
  styleUrls: ['./expenses-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesActionsComponent {
  @Input() isLoading = false; // TODO: convert this to Observable

  constructor(private dialog: MatDialog, private store: Store<ExpensesState>) {}

  onPopModal() {
    const config: MatDialogConfig<CreateExpenseConfig> = {
      data: {
        reasons: storeSnapshot(this.store, selectExpenseReasons),
      },
      panelClass: 'create-expense-dialog',
      maxHeight: '80vh',
    };
    this.dialog
      .open(CreateExpenseDialogComponent, config)
      .afterClosed()
      .pipe(filter((res) => res !== undefined && res !== null))
      .subscribe(
        (res: { reason: ExpenseReason; amount: number; date: Date }) => {
          const { reason, amount, date } = res;
          const user = storeSnapshot(this.store, getCurrentUser);
          // update the store optimistically
          const clientId = (Math.random() * 10000).toString();

          this.store.dispatch(
            createExpense({
              reason: reason._id,
              amount,
              date,
              clientId,
              user: user._id,
            })
          );
        }
      );
  }
}
