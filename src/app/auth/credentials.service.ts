import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Logger } from '@app/@core/logger.service';

const log = new Logger('CredentialsService');

export interface Credentials {
  // Customize received credentials here
  tokens: any;
  user: any;
}

const credentialsKey = 'credentials';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  private _credentials: Credentials | null = null;

  constructor(private router: Router) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return this._credentials;
  }

  get token(): string | null {
    if (this._credentials != null) {
      return this._credentials.tokens.access.token;
    } else {
      return '';
    }
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  resetCredentials() {
    sessionStorage.removeItem(credentialsKey);
    localStorage.removeItem(credentialsKey);
    this._credentials = null;
    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.router.navigate(['/login']);
  }
}
