import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { Store } from '@ngrx/store';
import { getCurrentUser } from '../../auth/store';
import { storeSnapshot } from '../../shared/utils';
import { PushNotificationService } from '../../core/services';
import { environment } from 'apps/roomies/src/environments/environment';

@Component({
  selector: 'roomies-expenses-view',
  templateUrl: './expenses.view.html',
  styleUrls: ['./expenses.view.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesViewComponent implements OnInit {
  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush,
    private notifier: PushNotificationService,
    private store: Store
  ) {}

  get user() {
    return storeSnapshot(this.store, getCurrentUser);
  }

  ngOnInit(): void {
    if (this.swPush.isEnabled) {
      if (Notification.permission === 'default') {
        this.subscribeToNotifications(!this.user.hasEnabledPushNotifications);
      }

      if (Notification.permission === 'denied') {
        console.warn('Notifications blocked!');
      }
    }

    if (this.swUpdate.isEnabled) {
      this.swUpdate.available.subscribe(() => {
        //TODO: create  custom dialog for this!
        if (confirm('New version available. Load New Version?')) {
          window.location.reload();
        }
      });

      this.swUpdate.activated.subscribe((event) => {
        console.log('old version was', event.previous);
        console.log('new version is', event.current);
      });
    }
  }

  subscribeToNotifications(saveSub = true) {
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.VAPID_PUBLIC_KEY,
      })
      .then((sub) => {
        if (saveSub) {
          return this.notifier
            .createNotificationSub(sub, this.user._id)
            .toPromise();
        } else {
          return true;
        }
      })
      .catch((err) =>
        console.error('Could not subscribe to notifications', err)
      );
  }
}
