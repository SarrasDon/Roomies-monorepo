import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@roomies/user.contracts';
import { environment } from '../../../environments/environment';
import { UsersService } from '../../core/services';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends UsersService {
  constructor(public http: HttpClient) {
    super(http);
  }

  login(email: string, password: string) {
    return this.http.post<{
      user: User;
      access_token: string;
    }>(`${environment.AWS_AUTH_API_URL}/login/`, {
      email,
      password,
    });
  }

  refresh(user: User) {
    return this.http.post<{
      user: User;
      access_token: string;
    }>(`${environment.AWS_AUTH_API_URL}/refresh/`, {
      user,
    });
  }
}
