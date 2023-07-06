import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private CALLBACK_PARAM_NAME: string = 'callback';

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

    console.log(this.getHref());
    
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    }

    const currentURL = new URL(window.location.href);
    if (currentURL.searchParams.get(this.CALLBACK_PARAM_NAME)) {
      if (currentURL.hash) {
        this.authService.loginWithToken(currentURL.hash);
        this.router.navigateByUrl('/home');
      }
    }
  }

  public getHref(): string {
    let redirectUrl: URL = new URL(window.location.href.split(/[?#]/)[0]);
    redirectUrl.searchParams.append(this.CALLBACK_PARAM_NAME, 'true');
    
    return 'https://guessthenumber.azurewebsites.net/.auth/login/github?post_login_redirect_uri=/user/postlogin?targetURL=' + encodeURIComponent(redirectUrl.toString());
  }

  public rerouteToExternalLogin() {
    window.open(this.getHref(), '_self');
  }

}