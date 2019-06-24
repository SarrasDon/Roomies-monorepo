import { Component, OnInit, Inject } from '@angular/core';
import { SnackbarMessage } from '../../../shared/enums';
import { SnackbarConfig } from '../../../shared/interfaces';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'roomies-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: [`./snackbar.component.scss`]
})
export class SnackbarComponent implements OnInit {
  message = this.config.message;
  type = this.config.type;
  url =
    this.type === SnackbarMessage.Success
      ? '/assets/icons/toast_done.svg'
      : '/assets/icons/toast_warning.svg';

  constructor(@Inject(MAT_SNACK_BAR_DATA) public config: SnackbarConfig) {}

  ngOnInit() {}
}
