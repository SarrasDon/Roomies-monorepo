import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import * as Containers from './containers';
import * as pipes from './pipes';
import { States } from './state';
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
    Components.CreateExpenseDialogComponent,
    Components.ExpensesActionsComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ExpensesViewComponent
      }
    ]),
    NgxsModule.forFeature(States),
    NgxChartsModule
  ],

  entryComponents: [Components.CreateExpenseDialogComponent]
})
export class ExpensesModule {}
