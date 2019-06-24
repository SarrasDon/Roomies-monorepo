import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../components/snackbar/snackbar.component';
import { SnackbarMessage } from '../../shared/enums';
import { SnackbarConfig } from '../../shared/interfaces';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  durationInSeconds = 3;
  config: MatSnackBarConfig = {
    panelClass: 'roomates-snackbar',
    duration: this.durationInSeconds * 1000
  };
  constructor(private _snackBar: MatSnackBar, private http: HttpClient) {}

  success(message: string) {
    this.openSnackBar(message, SnackbarMessage.Success);
  }

  fail(message: string) {
    this.openSnackBar(message, SnackbarMessage.Fail);
  }

  private openSnackBar(message: string, type: SnackbarMessage) {
    const data: SnackbarConfig = { message, type };
    return this._snackBar.openFromComponent(SnackbarComponent, {
      ...this.config,
      data
    });
  }
}
