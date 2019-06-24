import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Login, SignUp } from '../state/auth.actions';

@Component({
  selector: 'roomies-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent implements OnInit, OnDestroy {
  private unSubscribe = new Subject();
  form!: FormGroup;
  errorMsg: string;
  email = this.fb.control('', [Validators.required, Validators.email]);
  password = this.fb.control('', [Validators.required]);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: this.email,
      password: this.password
    });
  }

  onSignIn() {
    if (!this.form.dirty || !this.form.valid) {
      return;
    }
    const { email, password } = this.form.value;
    this.store
      .dispatch(new Login(email, password))
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        () => this.handleLoginSuccess(),
        error => this.handleLoginFail(error)
      );
  }

  onSignUp() {
    if (!this.form.dirty || !this.form.valid) {
      return;
    }
    const { email, password } = this.form.value;
    this.store
      .dispatch(new SignUp(email, password))
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        () => this.handleLoginSuccess(),
        error => this.handleLoginFail(error)
      );
  }

  handleLoginSuccess() {
    this.router.navigate(['/expenses']);
  }

  handleLoginFail(error: HttpErrorResponse) {
    switch (error.error.statusCode) {
      case 400: {
        this.errorMsg = 'Invalid username or password!';
        setTimeout(() => (this.errorMsg = ''), 3000);
        break;
      }
      default: {
        this.errorMsg = 'Invalid username or password!';
        setTimeout(() => (this.errorMsg = ''), 3000);
      }
    }
  }

  ngOnDestroy(): void {
    this.unSubscribe.next();
    this.unSubscribe.complete();
  }
}
