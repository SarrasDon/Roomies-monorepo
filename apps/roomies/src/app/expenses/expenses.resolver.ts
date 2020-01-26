import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { ExpensesService } from './services';
import { tap } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { SetExpensesCount, SetExpensesReasons } from './state';
import { ExpenseReason } from '../shared/models';

@Injectable({ providedIn: 'root' })
export class HnResolver
  implements Resolve<Observable<[number, ExpenseReason[]]>> {
  constructor(private expensesService: ExpensesService, private store: Store) {}

  resolve() {
    const count$ = this.expensesService
      .getExpenseCount()
      .pipe(tap(count => this.store.dispatch(new SetExpensesCount(count))));

    const reasons$ = this.expensesService
      .getExpenseReasons()
      .pipe(
        tap(reasons => this.store.dispatch(new SetExpensesReasons(reasons)))
      );

    return forkJoin([count$, reasons$]);
  }
}
