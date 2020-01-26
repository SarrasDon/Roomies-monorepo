import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { User } from '../../shared/models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends DataService<User> {
  constructor(public http: HttpClient) {
    super(http);
    this.featureUrl = 'users';
  }
}
