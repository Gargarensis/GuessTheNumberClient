import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/* Service to handle login/logout and the auth token */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_COOKIE_NAME: string = 'AUTH_COOKIE';
  private ZUMO_AUTH_HEADER: string = 'X-ZUMO-AUTH';

  constructor(
    private cookieService: CookieService,
    private router: Router) { }

  /* Redirects the user to the login page */
  public goToLogin(): void {
      this.router.navigateByUrl('/login');
  }

  /* Returns true if the user is logged in, false otherwise */
  public isLoggedIn(): boolean {
    const cookie: string = this.cookieService.get(this.AUTH_COOKIE_NAME);

    try {
      if (this.isTokenExpired(cookie)) {
        this.cookieService.delete(this.AUTH_COOKIE_NAME);
        return false;
      }
    } catch (exception) {
      return false;
    }
    
    return cookie != null && cookie.length > 1;
  }

  /* Checks if the auth token has expired */
  private isTokenExpired(token: string): boolean {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  /* Logouts the user and deletes his auth cookie */
  public logout(): void {
    this.cookieService.delete(this.AUTH_COOKIE_NAME);
    this.router.navigateByUrl('/home');
  }

  /* Logs the user in by saving his auth token */
  public loginWithToken(token: string) {
    this.cookieService.set(this.AUTH_COOKIE_NAME, token);
  }

  /* Returns the auth token or an empty string if the token is not present */
  public getToken(): string {
    return this.cookieService.get(this.AUTH_COOKIE_NAME) || '';
  }

  /* Build an header object containing the auth header to be used in authenticated requests */
  public getAuthenticatedHeaders(): { headers: { [x: string]: string; } } {
    return {
      headers: { [this.ZUMO_AUTH_HEADER]: this.getToken() }
    };
  }
}
