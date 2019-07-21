import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { HeaderComponent } from './components/header/header.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { HeaderContainerComponent } from './containers/header/header.container';

@NgModule({
  declarations: [HeaderComponent, SnackbarComponent, HeaderContainerComponent],
  imports: [SharedModule],
  exports: [HeaderContainerComponent],
  entryComponents: [SnackbarComponent]
})
export class CoreModule {}
