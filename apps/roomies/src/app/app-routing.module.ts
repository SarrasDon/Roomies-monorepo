import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/components/auth.component';
import { ExpensesResolver } from './expenses/expenses.resolver';
import { ExpensesViewComponent } from './expenses/views/expenses.view';

const routes: Routes = [
  { path: '', redirectTo: '/expenses', pathMatch: 'full' },
  {
    path: 'expenses',
    component: ExpensesViewComponent,
    resolve: { message: ExpensesResolver },
    canActivate: [AuthGuard],
    // for lazy loading
    // loadChildren: () =>
    //   import('./expenses/expenses.module').then((m) => m.ExpensesModule),
    // canLoad: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule { }
