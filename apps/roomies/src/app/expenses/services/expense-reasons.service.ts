import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ExpenseReason } from '@roomies/expenses.contracts';

@Injectable({ providedIn: 'root' })
export class ExpensesReasonsService {
  constructor(public http: HttpClient) {}

  get() {
    return this.http.get<ExpenseReason[]>(
      `${environment.AWS_EXPENSES_API_URL}/expenseReasons`
    );
  }
}
