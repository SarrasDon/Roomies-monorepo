import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarMessage } from '../../shared/enums';
import { SnackbarConfig } from '../../shared/interfaces';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  durationInSeconds = 3;
  config: MatSnackBarConfig = {
    panelClass: 'roomies-snackbar-container',
    duration: this.durationInSeconds * 1000,
  };
  constructor(private _snackBar: MatSnackBar) {}

  success(message: string) {
    this.openSnackBar(message, SnackbarMessage.Success);
  }

  fail(message: string) {
    this.openSnackBar(message, SnackbarMessage.Fail);
  }

  private openSnackBar(message: string, type: SnackbarMessage) {
    const data: SnackbarConfig = {
      message,
      type,
    };
    return this._snackBar.openFromComponent(SnackbarComponent, {
      ...this.config,
      data,
    });
  }
}
