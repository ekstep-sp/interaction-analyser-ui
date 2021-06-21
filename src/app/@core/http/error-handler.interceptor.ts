import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '@env/environment';
import { Logger } from '../logger.service';
import { NotificationService } from '@app/@shared';
import { CredentialsService } from '@app/auth/credentials.service';

const log = new Logger('ErrorHandlerInterceptor');

/**
 * Adds a default error handler to all requests.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  constructor(public notifiactionService: NotificationService, private credentialService: CredentialsService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      this.notifiactionService.initNotification('danger', response.error.message);
      log.error('Request error', response);
      log.error('Request error', JSON.stringify(response.status));
      this.credentialService.resetCredentials();
    } else {
      this.notifiactionService.initNotification('danger', response.error.message);
      this.credentialService.resetCredentials();
      throw response;
    }

    throw response;
  }
}
