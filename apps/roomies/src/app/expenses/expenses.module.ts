import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import { MonthlyExpensesComponent } from './components/monthly-expenses/monthly-expenses.component';
import {
  AnimateAddExpensesDirective,
  AnimateTotalIncreaseDirective,
  AnimateTotalsShadowDirective,
} from './directives';
import * as pipes from './pipes';
import {
  ExpensesEffects,
  expensesFeatureKey,
  expensesReducer,
  monthlyExpenseFeatureKey,
  monthlyExpensesReducer,
  TotalsEffects,
  totalsFeatureKey,
  totalsReducer,
} from './store';
import { MonthlyExpensesEffects } from './store/monthlyExpenses.effects';
import { ExpensesViewComponent } from './views/expenses.view';

@NgModule({
  declarations: [
    Components.ExpensesListComponent,
    Components.ExpenseItemComponent,
    Components.TotalsComponent,
    ExpensesViewComponent,
    pipes.ExpenseDatePipe,
    pipes.BalancePipe,
    pipes.ExpenseAmountPipe,
    Components.CreateExpenseDialogComponent,
    Components.ExpensesActionsComponent,
    AnimateAddExpensesDirective,
    AnimateTotalsShadowDirective,
    AnimateTotalIncreaseDirective,
    Components.ExpensesSpriteComponent,
    MonthlyExpensesComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature(totalsFeatureKey, totalsReducer),
    StoreModule.forFeature(expensesFeatureKey, expensesReducer),
    StoreModule.forFeature(monthlyExpenseFeatureKey, monthlyExpensesReducer),
    EffectsModule.forFeature([
      TotalsEffects,
      ExpensesEffects,
      MonthlyExpensesEffects,
    ]),
    NgxChartsModule,
  ],

  entryComponents: [Components.CreateExpenseDialogComponent],
})
export class ExpensesModule {}
