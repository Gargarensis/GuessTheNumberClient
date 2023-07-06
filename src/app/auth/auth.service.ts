import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private AUTH_COOKIE_NAME: string = "AUTH_COOKIE";
  private ZUMO_AUTH_HEADER: string = "X-ZUMO-AUTH";

  constructor(
    private httpClient: HttpClient, 
    private cookieService: CookieService,
    private router: Router) { }

  public goToLogin(): void {
      this.router.navigateByUrl('/login');
  }

  public isLoggedIn(): boolean {
    let cookie: string = this.cookieService.get(this.AUTH_COOKIE_NAME);

    return cookie != null && cookie.length > 1;
  }

  public logout(): void {
    this.cookieService.delete(this.AUTH_COOKIE_NAME);
    this.router.navigateByUrl('/home');
  }

  public loginWithToken(token: string) {
    this.cookieService.set(this.AUTH_COOKIE_NAME, token);
  }

}
