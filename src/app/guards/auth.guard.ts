import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  const auth: AngularFireAuth = inject(AngularFireAuth)
  const router: Router = inject(Router);

  return auth.authState.pipe(map(user => {

    const queryParams = {
      redirectTo: route.routeConfig?.path
    };
    
    if (user) {
      return true;
    } else {
      router.navigate(['/login'], { queryParams }); // Redirect to login page if not logged in
      return false;
    }
  }));
};
