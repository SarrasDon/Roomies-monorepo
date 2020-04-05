import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../core/services';
import { User } from '@roomies/user.contracts';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends UsersService {
  constructor(public http: HttpClient) {
    super(http);
  }

  login(email: string, password: string) {
    return this.http.post<{
      user: User;
      access_token: string;
    }>(`${environment.API_URL}auth/login/`, {
      email,
      password
    });
  }

  refresh(user: User) {
    return this.http.post<{
      user: User;
      access_token: string;
    }>(`${environment.API_URL}auth/refresh/`, {
      ...user
    });
  }
}
