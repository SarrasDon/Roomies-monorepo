import { Component, OnInit, Inject, HostBinding } from '@angular/core';
import { SnackbarMessage } from '../../../shared/enums';
import { SnackbarConfig } from '../../../shared/interfaces';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'roomies-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: [`./snackbar.component.scss`],
})
export class SnackbarComponent implements OnInit {
  message = this.config.message;
  url =
    this.config.type === SnackbarMessage.Success
      ? '/assets/icons/toast_done.svg'
      : '/assets/icons/toast_warning.svg';

  @HostBinding('class') classType =
    this.config.type === SnackbarMessage.Success
      ? 'snackbar-success'
      : 'snackbar-error';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public config: SnackbarConfig) {}

  ngOnInit() {}
}
