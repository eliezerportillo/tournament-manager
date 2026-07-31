import { Component, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '@app-core/services/account.service';
import { RouteService } from '@app-core/services/route.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  accountService = inject(AccountService);
  auth = inject(AngularFireAuth);
  router = inject(Router);
  route = inject(ActivatedRoute);
  routeService = inject(RouteService);

  menuLabel$ = this.accountService.currentUser$.pipe(
    map((user) => user?.displayName?.trim()),
  );

  async logout(): Promise<void> {
    await this.auth.signOut();
    const zone = this.routeService.findZoneRouteParam(this.route.snapshot);
    await this.router.navigate([zone ? `/${zone}` : '/']);
  }
}
