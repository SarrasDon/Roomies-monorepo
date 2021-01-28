import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from '../services';
import { getLoginError, login } from '../store';

@Component({
  selector: 'roomies-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
  form!: FormGroup;
  errorMsg$ = this.store.pipe(select(getLoginError));
  email = this.fb.control('', [Validators.required, Validators.email]);
  password = this.fb.control('', [Validators.required]);

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }

  onSubmit() {
    if (!this.form.dirty || !this.form.valid) {
      return;
    }
    const { email, password } = this.form.value;
    this.store.dispatch(login({ email, password }));
  }
}
