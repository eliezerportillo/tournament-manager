import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor() { }

  findZoneRouteParam(snapshot: ActivatedRouteSnapshot): string {
    let currentRoute: ActivatedRouteSnapshot | null = snapshot;
    while (currentRoute) {
      if (currentRoute.params['zone']) {
        return currentRoute.params['zone'];
      }
      currentRoute = currentRoute.parent;
    }
    return '';
  }
}
