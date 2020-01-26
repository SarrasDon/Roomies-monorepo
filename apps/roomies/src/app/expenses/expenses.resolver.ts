import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Store } from '@ngxs/store';
import { forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ExpenseReason } from '../shared/models';
import { ExpensesReasonsService, ExpensesService } from './services';
import { SetExpensesCount, SetExpensesReasons } from './state';

@Injectable({ providedIn: 'root' })
export class ExpensesResolver
  implements Resolve<Observable<[number, ExpenseReason[]]>> {
  constructor(
    private expensesService: ExpensesService,
    private expenseReasonsService: ExpensesReasonsService,
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

    return forkJoin([count$, reasons$]);
  }
}
