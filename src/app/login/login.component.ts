import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    if (this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/home');
    }

    const currentURL = new URL(window.location.href);
    if (currentURL.searchParams.get(this.CALLBACK_PARAM_NAME)) {
      if (currentURL.hash) {
        let decodedHash = decodeURIComponent(currentURL.hash);
        let jsonToken = JSON.parse(decodeURIComponent(decodedHash.replace('#token=', '')));
        this.authService.loginWithToken(jsonToken.authenticationToken);
        this.router.navigateByUrl('/home');
      }
    }
  }

  public getHref(): string {
    let redirectUrl: URL = new URL(window.location.href.split(/[?#]/)[0]);
    redirectUrl.searchParams.append(this.CALLBACK_PARAM_NAME, 'true');
    
    return environment.apiUrl + '/.auth/login/github?post_login_redirect_uri=/users/postlogin?targetURL=' + encodeURIComponent(redirectUrl.toString());
  }

  public rerouteToExternalLogin() {
    window.open(this.getHref(), '_self');
  }

}