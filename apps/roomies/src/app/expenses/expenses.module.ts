import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import * as Containers from './containers';
import { ExpensesResolver } from './expenses.resolver';
import * as pipes from './pipes';
import {
  expensesFeatureKey,
  expensesReducer,
  totalsFeatureKey,
  totalsReducer,
} from './state';
import { ExpensesViewComponent } from './views/expenses.view';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TotalsEffects } from './state/totals.effects';
import { ExpensesEffects } from './state/expenses.effects';

@NgModule({
  declarations: [
    Containers.ExpensesListContainer,
    Containers.TotalsContainerComponent,
    Components.ExpensesListComponent,
    Components.ExpenseItemComponent,
    Containers.ExpensesActionsContainer,
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
