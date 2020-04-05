import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services';
import { Total } from '../../shared/models';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';

@Injectable({ providedIn: 'root' })
export class ExpensesService extends DataService<Expense> {
  constructor(public http: HttpClient) {
    super(http);
    this.featureUrl = 'expenses';
  }

  getExpenses(index: number, limit: number) {
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
