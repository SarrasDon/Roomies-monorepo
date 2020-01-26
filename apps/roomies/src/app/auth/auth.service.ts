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
    return this.http.post<User>(`${environment.API_URL}users/`, {
      email,
      password
    });
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${environment.API_URL}users/login/`, {
      email,
      password
    });
  }
}
