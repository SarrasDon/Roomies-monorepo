import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import theme from '../theme.config.json';
import * as Components from './components';
import {
  AnimateAddExpensesDirective,
  AnimateTotalIncreaseDirective,
  AnimateTotalsShadowDirective,
} from './directives';
import * as pipes from './pipes';
import { EXPENSE_ITEM_HEIGHT_TOKEN } from './services';
import {
  ExpensesEffects,
  featureModuleKey,
  featureReducersMap,
  TotalsEffects,
} from './store';
import { MonthlyExpensesEffects } from './store/monthlyExpenses.effects';
import { ExpensesViewComponent } from './views/expenses.view';

@NgModule({
  declarations: [
    Components.ExpensesListComponent,
    Components.ExpenseItemComponent,
    Components.TotalsComponent,
    Components.DeleteConfirmationComponent,
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
    Components.MonthlyExpensesComponent,
  ],
  providers: [
    {
      provide: EXPENSE_ITEM_HEIGHT_TOKEN,
      useValue: theme['expense-item-height'],
    },
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature(featureModuleKey, featureReducersMap, {}),
    EffectsModule.forFeature([
      TotalsEffects,
      ExpensesEffects,
      MonthlyExpensesEffects,
    ]),
    NgxChartsModule,
  ],

  entryComponents: [
    Components.CreateExpenseDialogComponent,
    Components.DeleteConfirmationComponent,
  ],
})
export class ExpensesModule {}
