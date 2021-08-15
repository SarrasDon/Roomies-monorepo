import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@roomies/user.contracts';
import { environment } from 'apps/roomies/src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(public http: HttpClient) {}

  get() {
    return this.http.get<User[]>(`${environment.AWS_EXPENSES_API_URL}/users`);
  }
}
