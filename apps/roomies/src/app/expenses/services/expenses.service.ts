import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services';
import { Expense, ExpenseReason, Total } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ExpensesService extends DataService<Expense> {
  constructor(public http: HttpClient) {
    super(http);
    this.featureUrl = 'expenses';
  }

  getExpenses(index: number, limit: number) {
    // const access_token = document.cookie.split('access_token=')[1];

    return this.http.get<Expense[]>(
      // `${this.featureUrl}?userId=${id}&index=${index}&limit=${limit}`
      `${this.featureUrl}?index=${index}&limit=${limit}`
    );
  }

  getExpenseReasons() {
    return this.http.get<ExpenseReason[]>(`${this.featureUrl}/reasons`);
  }

  getTotals() {
    return this.http.get<Total[]>(`${this.featureUrl}/totals`);
  }
}
