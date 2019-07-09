import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import * as Components from './components';
import * as Containers from './containers';
import * as pipes from './pipes';
import { ExpensesService } from './services';
import { States } from './state/module.state';
import { ExpensesViewComponent } from './views/expenses.view';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    Containers.ExpensesListContainer,
    Containers.CreateExpenseContainerComponent,
    Containers.TotalsContainerComponent,
    Components.ExpensesListComponent,
    Components.ExpenseItemComponent,
    Components.CreateExpenseComponent,
    Components.TotalsComponent,
    ExpensesViewComponent,
    pipes.ExpenseDatePipe
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
  providers: [ExpensesService]
})
export class ExpensesModule {}
