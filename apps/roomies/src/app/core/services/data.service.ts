import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Entity } from '@roomies/shared.data';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataService<T extends Entity> {
  private _featureUrl = '';
  protected set featureUrl(url: string) {
    this._featureUrl = `${environment.API_URL}${url}`;
  }
  protected get featureUrl() {
    return this._featureUrl;
  }

  constructor(public http: HttpClient) { }

  get() {
    return this.http.get<T[]>(this.featureUrl);
  }

  getById(id: string) {
    return this.http.get<T>(`${this.featureUrl}/${id}`);
  }

  count() {
    return this.http.get<number>(`${this.featureUrl}/count`);
  }

  create(resource: any) {
    return this.http.post<T>(this.featureUrl, JSON.stringify(resource));
  }

  delete(id: string) {
    return this.http.delete(`${this.featureUrl}/${id}`);
  }

  update(id: string, resource: any) {
    return this.http.put(`${this.featureUrl}/${id}`, JSON.stringify(resource));
  }

  serializeQueryParameters(params: { [key: string]: string | number }) {
    return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
  }
}
