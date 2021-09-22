import { LayoutModule } from '@angular/cdk/layout';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerModule,
  HAMMER_GESTURE_CONFIG,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptorService } from './auth/services';
import { CoreModule } from './core/core.module';
import {
  BaseInterceptorService,
  HammerConfig,
  UnauthorizedInterceptorService,
} from './core/services';
import { ExpensesModule } from './expenses/expenses.module';
import { SharedModule } from './shared/shared.module';

export const cloudinaryLib = {
  Cloudinary: CloudinaryCore,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    CoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: 'donatos' }),
    LayoutModule,
    StoreModule.forRoot(
      {},
      {
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
        },
      }
    ),
    EffectsModule.forRoot(),
    !environment.production
      ? StoreDevtoolsModule.instrument({
          maxAge: 25, // Retains last 25 states
        })
      : [],
    ExpensesModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
    HammerModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptorService,
      multi: true,
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
