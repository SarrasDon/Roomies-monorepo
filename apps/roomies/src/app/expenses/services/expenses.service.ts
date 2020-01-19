import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ExpenseReason, Expense, Total } from '../../shared/models';
import { environment } from 'apps/roomies/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  private readonly feature_url = 'expenses';
  private readonly base_url = `${environment.API_URL}${this.feature_url}`;

  constructor(private http: HttpClient) {}

  getExpenses(index: number, limit: number) {
    return this.http.get<Expense[]>(
      // `${this.base_url}?userId=${id}&index=${index}&limit=${limit}`
      `${this.base_url}?index=${index}&limit=${limit}`
    );
  }

  getExpenseReasons() {
    return this.http.get<ExpenseReason[]>(`${this.base_url}/reasons`);
  }

  createExpense(reason: string, amount: number, spendAt: Date, person: string) {
    return this.http.post(
      `${this.base_url}`,
      JSON.stringify({ reason, amount, person, spendAt }),
      this.httpOptions
    );
  }

  getTotals() {
    return this.http.get<Total[]>(`${this.base_url}/totals`);
  }
}
