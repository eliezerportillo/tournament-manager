import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { environment } from '@app-environments/environment';
import { RouteService } from '@app-core/services/route.service';

export const authGuard: CanActivateFn = (route, state) => {

  const auth: AngularFireAuth = inject(AngularFireAuth)
  const router: Router = inject(Router);
  const routeService = inject(RouteService);

  return auth.authState.pipe(map(user => {
    if (!environment.production) return true;
    
    const queryParams = {
      redirectTo: state.url
    };

    if (user) {
      return true;
    } else {
      const zone = routeService.findZoneRouteParam(route);      
      router.navigate([`/${zone}/login`], { queryParams }); 
      return false;
    }
  }));
};
