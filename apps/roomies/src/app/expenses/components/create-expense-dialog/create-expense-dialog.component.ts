import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { UiService } from '../../../core/services/ui.service';
import { CreateExpenseConfig } from '../../../shared/interfaces';

@Component({
  selector: 'roomies-create-expense-dialog',
  templateUrl: './create-expense-dialog.component.html',
  styleUrls: ['./create-expense-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExpenseDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateExpenseConfig,
    private dialog: MatDialogRef<CreateExpenseDialogComponent>,
    private fb: FormBuilder,
    private uiService: UiService
  ) { }
  /** Helper to get type safety/intellisense. */
  get formValue() {
    return this.form.value as {
      reason: ExpenseReason;
      amount: number;
      date: Date;
    };
  }
  form: FormGroup;
  reason = new FormControl(null, Validators.required);
  amount = new FormControl(null, [Validators.required, Validators.min(0.1)]);
  date = new FormControl(new Date(), Validators.required);
  maxDate = new Date();

  validationMessages = {
    reason: {
      required: '* Reason is required!'
    },
    amount: {
      required: '* Amount is required!',
      min: '* Amount must be more than 0!'
    },
    date: {
      required: '* Payment date is required!'
    }
  };

  ngOnInit() {
    this.form = this.fb.group({
      reason: this.reason,
      amount: this.amount,
      date: this.date
    });
  }

  showError(control: string) {
    return this.form.get(control).dirty && this.form.get(control).invalid;
  }

  controlErrors(control: string) {
    return this.validationMessages[control][Object.keys(this.amount.errors)[0]];
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }
    const now = new Date();
    this.formValue.date.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );
    this.dialog.close(this.formValue);
    this.uiService.newExpenseSubmitted.next(true)
  }
}
