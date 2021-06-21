import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Credentials, CredentialsService } from '../auth/credentials.service';

const routes = {
  getSessions: (c: SessionsListContext) => `/meeting?sortBy=heldOn:desc&limit=${c.limit}&page=${c.page}`,
};

export interface SessionsListContext {
  limit: number;
  page: number;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  currentSession = {};
  sessionStatsUrl = '/meeting/';
  constructor(private credentialsService: CredentialsService, private httpClient: HttpClient) {}

  getSessionsList(context: SessionsListContext): Observable<string> {
    return this.httpClient.get(routes.getSessions(context)).pipe(
      map((body: any) => body),
      catchError((err) => of(err))
    );
  }

  setCurrentSessionContext(session: any) {
    this.currentSession = session;
  }

  getCurrentSession() {
    return this.currentSession;
  }

  getSessionStats(): Observable<string> {
    return this.httpClient.get(`${this.sessionStatsUrl}${(this.currentSession as any).id}`).pipe(
      map((body: any) => body),
      catchError((err) => of(err))
    );
  }
}
