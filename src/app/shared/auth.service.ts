import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as decode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from './user.model';
import { NotificationsService } from './notifications.service';


export const TOKEN_NAME = 'jwt_token';
export const SERVER_URL = 'http://localhost:3000';

@Injectable()
export class AuthService {
  usernameChange$ = new BehaviorSubject<string>(null);

  private _username: string;

  constructor(private http: HttpClient, private ns: NotificationsService) {
    const token = this.getToken();

    if (token && !this.isTokenExpired(token)) {
      const decoded = decode(token);
      this.username = decoded.username;
    }
  }

  get username() {
    return this._username;
  }

  set username(newUsername: string) {
    this.usernameChange$.next(newUsername);
    this._username = newUsername;
  }

  getToken(): string {
    return localStorage.getItem(TOKEN_NAME);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_NAME, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_NAME);
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      return true;
    }

    const date = this.getTokenExpirationDate(token);

    if (date === undefined) {
      return false;
    }
    return !(date.valueOf() > new Date().valueOf());
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = decode(token);

    if (decoded.exp === undefined) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  login(user: User) {
    return this.http
      .post(`${SERVER_URL}/user/login`, user)
      .subscribe((data: { token: string }) => {
        const decoded = decode(data.token);

        this.setToken(data.token);
        this.username = decoded.username;
        this.ns.emit('Successfully login');
      });
  }

  logout() {
    this.username = null;
    this.removeToken();
  }
}
