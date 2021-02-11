import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

@NgModule({
  declarations: [HeaderComponent, SnackbarComponent],
  imports: [SharedModule],
  exports: [HeaderComponent],
  entryComponents: [SnackbarComponent],
})
export class CoreModule {}
