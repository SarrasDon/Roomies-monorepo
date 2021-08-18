import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Total } from '../../shared/models';
import { MonthlyExpense } from '../store';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private awsUrl = `${environment.AWS_EXPENSES_API_URL}`;
  private cache$ = new Map<string, Observable<Array<MonthlyExpense>>>();

  constructor(public http: HttpClient) {}

  count() {
    return this.http.get<number>(`${this.awsUrl}/count`);
  }

  getExpenses(index: number, limit: number) {
    const params = { index, limit };
    const queryParams = this.serializeQueryParameters(params);
    return this.http.get<Expense[]>(
      `${this.awsUrl}/expensesPaged?${queryParams}`
    );
  }

  getExpenseReasons() {
    return this.http.get<ExpenseReason[]>(`${this.awsUrl}/expenseReasons`);
  }

  getTotals() {
    return this.http.get<Total[]>(`${this.awsUrl}/totals`);
  }

  getMonthlyExpenses({ month, year }) {
    const key = `${year}_${month}`;
    if (!this.cache$.has(key)) {
      const queryParams = this.serializeQueryParameters({ month, year });
      this.cache$.set(
        key,
        this.http
          .get<[]>(`${this.awsUrl}/expensesMonthly?${queryParams}`)
          .pipe(shareReplay(1))
      );
    }
    return this.cache$.get(key);
  }

  invalidateCache({ month, year }) {
    const key = `${year}_${month}`;
    if (this.cache$.has(key)) {
      this.cache$.delete(key);
    }
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

  serializeQueryParameters(params: { [key: string]: string | number }) {
    return Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  }
}
