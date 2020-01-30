import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<User>(`${environment.API_URL}auth/`, {
      email,
      password
    });
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
}
