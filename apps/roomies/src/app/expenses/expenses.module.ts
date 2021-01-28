import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import * as Containers from './containers';
import { ExpensesResolver } from './expenses.resolver';
import * as pipes from './pipes';
import { totalsFeatureKey, totalsReducer, expensesFeatureKey, expensesReducer, TotalsEffects, ExpensesEffects } from './store';

import { ExpensesViewComponent } from './views/expenses.view';

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
export class ExpensesModule { }
