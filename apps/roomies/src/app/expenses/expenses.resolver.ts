import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store as NgxsStore } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExpensesReasonsService, ExpensesService } from './services';
import { SetExpensesCount, SetExpensesReasons } from './state';
import { UsersService } from '../core/services/users.service';
import { ExpenseReason } from '@roomies/expenses.contracts';
import { User } from '@roomies/user.contracts';
import { usersLoaded } from '../auth/state';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ExpensesResolver
  implements Resolve<Observable<[number, ExpenseReason[], User[]]>> {
  constructor(
    private expensesService: ExpensesService,
    private expenseReasonsService: ExpensesReasonsService,
    private usersService: UsersService,
    private ngxsStore: NgxsStore,
    private store: Store
  ) {}

  resolve() {
    const count$ = this.expensesService
      .count()
      .pipe(
        tap((count) => this.ngxsStore.dispatch(new SetExpensesCount(count)))
      );

    const reasons$ = this.expenseReasonsService
      .get()
      .pipe(
        tap((reasons) =>
          this.ngxsStore.dispatch(new SetExpensesReasons(reasons))
        )
      );

    const users$ = this.usersService
      .get()
      .pipe(tap((users) => this.store.dispatch(usersLoaded({ users }))));

    return forkJoin([count$, reasons$, users$]);
  }
}
