import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense, ExpenseReason } from '@roomies/expenses.contracts';
import { environment } from '../../../environments/environment';
import { Total } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  awsUrl = `${environment.AWS_EXPENSES_API_URL}`;

  constructor(public http: HttpClient) {}

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
    >(`${this.awsUrl}/expensesPaged?${queryParams}`);
  }

  getExpenseReasons() {
    return this.http.get<ExpenseReason[]>(`${this.awsUrl}/expenseReasons`);
  }

  getTotals() {
    return this.http.get<Total[]>(`${this.awsUrl}/totals`);
  }

  // getTotalsForMonth({ month, year }) {
  //   const params = { month, year };
  //   const queryParams = this.serializeQueryParameters(params);
  //   return this.http.get<Total[]>(
  //     `${this.featureUrl}/totalsForMonth?${queryParams}`
  //   );
  // }

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
