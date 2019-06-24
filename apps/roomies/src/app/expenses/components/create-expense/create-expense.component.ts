import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import '../../../shared/extensions/date.extensions';
import { ExpenseReason } from '../../../shared/models/expenseReason.model';
import { SnackbarService } from '../../../core/services';

@Component({
  selector: 'roomies-create-expense',
  templateUrl: './create-expense.component.html',
  styleUrls: ['./create-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateExpenseComponent implements OnInit {
  @Input() reasons: ExpenseReason[] = [];
  @Input() pending = false;
  @Output() formSubmitted = new EventEmitter<{
    reason: ExpenseReason;
    amount: number;
    date: Date;
  }>();

  form: FormGroup;
  reason = new FormControl(null, Validators.required);
  amount = new FormControl(0, [Validators.required, Validators.min(0.1)]);
  date = new FormControl(new Date(), Validators.required);
  maxDate = new Date();

  constructor(private fb: FormBuilder, private service: SnackbarService) {}

  ngOnInit() {
    this.form = this.fb.group({
      reason: this.reason,
      amount: this.amount,
      date: this.date
    });

    // this.form.valueChanges.subscribe(res => console.log(res));
  }

  /** Helper to get type safety/intellisense. */
  get formValue() {
    return this.form.value as {
      reason: ExpenseReason;
      amount: number;
      date: Date;
    };
  }

  onReset() {
    this.form.patchValue({ reason: null, amount: 0, date: new Date() });
  }

  onSubmit() {
    this.validate();
    if (!this.form.valid) {
      return;
    }
    this.formValue.date.copyHoursFrom(new Date());
    this.formSubmitted.emit(this.formValue);
  }

  validate() {
    if (this.form.valid) {
      return;
    }
    // TODO: fill validation logic
  }
}
