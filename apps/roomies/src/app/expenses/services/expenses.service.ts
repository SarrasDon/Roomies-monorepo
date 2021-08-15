import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from '../../core/services';
import { Total } from '../../shared/models';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpensesService extends DataService<Expense> {
  awsUrl = `${environment.AWS_EXPENSES_API_URL}`;

  constructor(public http: HttpClient) {
    super(http);
    this.featureUrl = 'expenses';
  }

  count() {
    return this.http.get<number>(`${this.awsUrl}/count`);
  }

  getExpenses(index: number, limit: number) {
    const params = { index, limit };
    const queryParams = this.serializeQueryParameters(params);
    return this.http.get<
      (Omit<Expense, 'reason' | 'person'> & {
        person: string;
        reason: string;
      })[]
    >(
      // `${this.awsUrl}?userId=${id}&index=${index}&limit=${limit}`
      `${this.awsUrl}/expensesPaged?${queryParams}`
    );
  }

  getExpenseReasons() {
    return this.http.get<ExpenseReason[]>(`${this.awsUrl}/expenseReasons`);
  }

  getTotals() {
    return this.http.get<Total[]>(`${this.awsUrl}/totals`);
  }

  getTotalsForMonth({ month, year }) {
    const params = { month, year };
    const queryParams = this.serializeQueryParameters(params);
    return this.http.get<Total[]>(
      `${this.featureUrl}/totalsForMonth?${queryParams}`
    );
  }

  create(resource: {
    reason: string;
    amount: number;
    spendAt?: Date;
    person: string;
  }) {
    return this.http.post<Expense>(
      `${this.awsUrl}/createExpense`,
      JSON.stringify(resource)
    );
  }
}
