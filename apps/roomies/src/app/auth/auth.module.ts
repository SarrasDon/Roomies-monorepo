import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxsModule } from '@ngxs/store';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './components/auth.component';
import { AuthState } from './state/auth.state';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    NgxsModule.forFeature([AuthState])
  ]
})
export class AuthModule {}
