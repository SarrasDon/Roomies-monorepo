import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { AuthComponent } from './components/auth.component';
import { AuthEffects, authFeatureKey, authReducer } from './store';

@NgModule({
  declarations: [AuthComponent],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature(authFeatureKey, authReducer),
    EffectsModule.forFeature([AuthEffects]),
  ]
})
export class AuthModule { }
