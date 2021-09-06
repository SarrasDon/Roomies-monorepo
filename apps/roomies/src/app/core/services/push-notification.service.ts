import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'apps/roomies/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  private awsUrl = `${environment.AWS_EXPENSES_API_URL}`;

  constructor(public http: HttpClient) {}

  createNotificationSub(sub: any, userId: string) {
    return this.http.post(
      `${this.awsUrl}/createNotificationSub`,
      JSON.stringify({ sub, userId })
    );
  }
}
