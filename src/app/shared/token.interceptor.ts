import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import * as URL from 'url';

import { AuthService } from './auth.service';
import { NotificationsService } from './notifications.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private whitelistedDomains: Array<string | RegExp> = ['localhost:3000'];
  private blacklistedRoutes: Array<string | RegExp> = [];

  constructor(private auth: AuthService, private ns: NotificationsService) {}

  handleInterception(
    token: string,
    request: HttpRequest<any>,
    next: HttpHandler
  ) {
    let tokenIsExpired: boolean;

    tokenIsExpired = token ? this.auth.isTokenExpired(token) : true;

    if (token && tokenIsExpired) {
      request = request.clone();
    } else if (
      token &&
      this.isWhitelistedDomain(request) &&
      !this.isBlacklistedRoute(request)
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.auth.getToken()}`
        }
      });
    }
    return next.handle(request);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this.auth.getToken();

    return this.handleInterception(token, request, next).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
          }
        },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status === 401) {
              this.ns.emit(err.message);
            }
          }
        }
      )
    );
  }

  private isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl = URL.parse(request.url, false, true);

    return (
      this.whitelistedDomains.findIndex(
        domain =>
          typeof domain === 'string'
            ? domain === requestUrl.host
            : domain instanceof RegExp ? domain.test(requestUrl.host) : false
      ) > -1
    );
  }

  private isBlacklistedRoute(request: HttpRequest<any>): boolean {
    const url = request.url;

    return (
      this.blacklistedRoutes.findIndex(
        route =>
          typeof route === 'string'
            ? route === url
            : route instanceof RegExp ? route.test(url) : false
      ) > -1
    );
  }
}
