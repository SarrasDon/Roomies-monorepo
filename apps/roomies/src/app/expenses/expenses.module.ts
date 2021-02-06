import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AuthGuard } from '../auth/auth.guard';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import { ExpensesResolver } from './expenses.resolver';
import * as pipes from './pipes';
import {
  ExpensesEffects,
  expensesFeatureKey,
  expensesReducer,
  TotalsEffects,
  totalsFeatureKey,
  totalsReducer,
} from './store';
import { ExpensesViewComponent } from './views/expenses.view';

@NgModule({
  declarations: [
    Components.ExpensesListComponent,
    Components.ExpenseItemComponent,
    Components.TotalsComponent,
    ExpensesViewComponent,
    pipes.ExpenseDatePipe,
    pipes.ExpenseImgSourcePipe,
    pipes.BalancePipe,
    pipes.ExpenseAmountPipe,
    Components.CreateExpenseDialogComponent,
    Components.ExpensesActionsComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExpensesViewComponent,
        resolve: { message: ExpensesResolver },
        canActivate: [AuthGuard],
      },
    ]),
    StoreModule.forFeature(totalsFeatureKey, totalsReducer),
    StoreModule.forFeature(expensesFeatureKey, expensesReducer),
    EffectsModule.forFeature([TotalsEffects, ExpensesEffects]),
    NgxChartsModule,
  ],

  entryComponents: [Components.CreateExpenseDialogComponent],
})
export class ExpensesModule {}
