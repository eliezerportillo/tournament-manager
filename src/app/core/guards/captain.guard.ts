import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of, from } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { PlayerService } from '@app-core/services/player.service';
import { AccountService } from '@app-core/services/account.service';
import { RouteService } from '@app-core/services/route.service';
import { IPlayer, Player } from '@app-core/models/player';
import { MatSnackBar } from '@angular/material/snack-bar';

export const captainGuard: CanActivateFn = (
  route,
  state
): Observable<boolean> => {
  const playerService = inject(PlayerService);
  const accountService = inject(AccountService);
  const router = inject(Router);
  const routeService = inject(RouteService);
  const snackBar = inject(MatSnackBar);

  return accountService.currentUser$.pipe(
    switchMap((user) => {
      if (!user || !user.email) {
        const zone = routeService.findZoneRouteParam(route);
        router.navigate([`/${zone}/login`], {
          queryParams: { redirectTo: state.url },
        });
        return of(false);
      }

      // Convert promise to observable
      return from(playerService.getPlayerByEmail(user.email)).pipe(
        map((player) => {
          if (!player) {
            snackBar.open(
              'No tienes un jugador asociado. Contacta al administrador.',
              'Cerrar',
              { duration: 5000 }
            );
            const zone = routeService.findZoneRouteParam(route);
            router.navigate([`/${zone}`]);
            return false;
          }

          // Validate captain status
          if (!Player.isCaptain(player)) {
            snackBar.open(
              'No tienes permisos de capitán para gestionar el equipo.',
              'Cerrar',
              { duration: 5000 }
            );
            const zone = routeService.findZoneRouteParam(route);
            router.navigate([`/${zone}`]);
            return false;
          }

          return true;
        }),
        catchError((error) => {
          console.error('Error validating captain permissions:', error);
          snackBar.open(
            'Error al validar permisos. Intenta nuevamente.',
            'Cerrar',
            { duration: 5000 }
          );
          const zone = routeService.findZoneRouteParam(route);
          router.navigate([`/${zone}`]);
          return of(false);
        })
      );
    }),
    catchError((error) => {
      console.error('Captain guard error:', error);
      snackBar.open('Error al validar permisos de capitán.', 'Cerrar', {
        duration: 5000,
      });
      const zone = routeService.findZoneRouteParam(route);
      router.navigate([`/${zone}`]);
      return of(false);
    })
  );
};
