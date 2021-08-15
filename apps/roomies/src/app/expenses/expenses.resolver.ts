import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngrx/store';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { User } from '@roomies/user.contracts';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { usersLoaded } from '../auth/store';
import { UsersService } from '../core/services/users.service';
import { Total } from '../shared/models';
import { ExpensesReasonsService, ExpensesService } from './services';
import { setExpensesCount, setExpensesReasons, totalsLoaded } from './store';

@Injectable({ providedIn: 'root' })
export class ExpensesResolver
  implements Resolve<Observable<[Total[], number, ExpenseReason[], User[]]>> {
  constructor(
    private expensesService: ExpensesService,
    private expenseReasonsService: ExpensesReasonsService,
    private usersService: UsersService,
    private store: Store
  ) {}

  resolve() {
    const count$ = this.expensesService
      .count()
      .pipe(tap((count) => this.store.dispatch(setExpensesCount({ count }))));

    const reasons$ = this.expenseReasonsService
      .get()
      .pipe(
        tap((reasons) => this.store.dispatch(setExpensesReasons({ reasons })))
      );

    const users$ = this.usersService
      .get()
      .pipe(tap((users) => this.store.dispatch(usersLoaded({ users }))));

    const totals$ = this.expensesService
      .getTotals()
      .pipe(tap((totals) => this.store.dispatch(totalsLoaded({ totals }))));

    return forkJoin([totals$, count$, reasons$, users$]);
  }
}
