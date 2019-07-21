import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Logout } from './auth/state/auth.actions';
import { AuthState } from './auth/state/auth.state';

@Component({
  selector: 'roomies-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  @Select(AuthState.isLoggedIn) isLoggedIn: Observable<boolean>;

  constructor(
    private store: Store,
    private router: Router,
    private actions: Actions
  ) {}

  ngOnInit(): void {
    this.actions.pipe(ofActionDispatched(Logout)).subscribe(() => {
      this.router.navigate(['/auth']);
    });
  }
}
