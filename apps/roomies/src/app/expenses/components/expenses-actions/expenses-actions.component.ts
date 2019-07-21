import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { CreateExpenseDialogComponent } from '../create-expense-dialog/create-expense-dialog.component';
import { CreateExpenseConfig } from '../../../shared/interfaces';
import { ExpenseReason } from '../../../shared/models';

@Component({
  selector: 'roomies-expenses-actions',
  templateUrl: './expenses-actions.component.html',
  styleUrls: ['./expenses-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpensesActionsComponent {
  @Input() reasons: ExpenseReason[] = [];
  @Output() formSubmitted = new EventEmitter<{
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }>();

  constructor(private dialog: MatDialog) {}

  onPopModal() {
    const config: MatDialogConfig<CreateExpenseConfig> = {
      data: {
        reasons: this.reasons
      },
      panelClass: 'create-expense-dialog',
      maxHeight: '80vh'
    };
    this.dialog
      .open(CreateExpenseDialogComponent, config)
      .afterClosed()
      .pipe(filter(res => res !== undefined && res !== null))
      .subscribe(res => this.formSubmitted.emit(res));
  }
}
