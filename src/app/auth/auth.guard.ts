import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

/* Guard to allow access to a route only if the user is logged in, otherwise redirect the user to the login page */
export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);

  if (authService.isLoggedIn()) {
    return true;
  }

  authService.goToLogin();
  return false;
};
