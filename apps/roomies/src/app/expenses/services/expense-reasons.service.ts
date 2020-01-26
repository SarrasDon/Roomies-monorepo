import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services';
import { ExpenseReason } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ExpensesReasonsService extends DataService<ExpenseReason> {
  constructor(public http: HttpClient) {
    super(http);
    this.featureUrl = 'expenseReasons';
  }
}
