import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';
import { Cloudinary as CloudinaryCore } from 'cloudinary-core';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from '@angular/cdk/layout';
import { AuthInterceptorService } from './auth/services';
import {
  BaseInterceptorService,
  UnauthorizedInterceptorService
} from './core/services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

export const cloudinaryLib = {
  Cloudinary: CloudinaryCore
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
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    // NgxsReduxDevtoolsPluginModule.forRoot({
    //   disabled: environment.production
    // }),
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: 'donatos' }),
    LayoutModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BaseInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
