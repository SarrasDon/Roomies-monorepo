import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../constants';
import { User } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    return this.http.post<User>(`${API_URL}users/`, {
      email,
      password
    });
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${API_URL}users/login/`, {
      email,
      password
    });
  }
}
