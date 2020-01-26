import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExpenseReason, User } from '../shared/models';
import { ExpensesReasonsService, ExpensesService } from './services';
import { SetExpensesCount, SetExpensesReasons } from './state';
import { UsersService } from '../core/services/users.service';
import { UsersLoaded } from '../auth/state/auth.actions';

@Injectable({ providedIn: 'root' })
export class ExpensesResolver
  implements Resolve<Observable<[number, ExpenseReason[], User[]]>> {
  constructor(
    private expensesService: ExpensesService,
    private expenseReasonsService: ExpensesReasonsService,
    private usersService: UsersService,
    private store: Store
  ) {}

  resolve() {
    const count$ = this.expensesService
      .count()
      .pipe(tap(count => this.store.dispatch(new SetExpensesCount(count))));

    const reasons$ = this.expenseReasonsService
      .get()
      .pipe(
        tap(reasons => this.store.dispatch(new SetExpensesReasons(reasons)))
      );

    const users$ = this.usersService
      .get()
      .pipe(tap(users => this.store.dispatch(new UsersLoaded(users))));

    return forkJoin([count$, reasons$, users$]);
  }
}
