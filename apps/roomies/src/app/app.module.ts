import { HttpClientModule } from '@angular/common/http';
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
import { Cloudinary } from '@cloudinary/angular-5.x/src/cloudinary.service';

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
    NgxsReduxDevtoolsPluginModule.forRoot({
      disabled: environment.production
    }),
    CloudinaryModule.forRoot(cloudinaryLib, { cloud_name: 'donatos' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
