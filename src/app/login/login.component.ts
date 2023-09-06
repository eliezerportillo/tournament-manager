import { Component, OnInit, inject } from '@angular/core';
import { AngularFireAuth, } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthProvider } from 'firebase/auth';
import { Location } from '@angular/common';
import { PlayerService } from '../services/player.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  auth: AngularFireAuth = inject(AngularFireAuth);
  router: Router = inject(Router);
  location: Location = inject(Location);
  route: ActivatedRoute = inject(ActivatedRoute);
  playerService: PlayerService = inject(PlayerService);
  snackBar: MatSnackBar = inject(MatSnackBar);

  redirectTo?: string;
  captains?: string[];



  async handleGoogle() {
    const r = await this.auth.signInWithPopup(new GoogleAuthProvider());
    if (r.user && r.user.email && this.captains) {
      if (this.captains.includes(r.user.email)) {
        this.router.navigate([this.redirectTo ? this.redirectTo : '/']);
      } else {
        this.snackBar.open('Solo los capitanes pueden acceder a esta sección. Revisar con organizadores.');
        await this.auth.signOut();
      }
    }

  }

  ngOnInit(): void {
    this.redirectTo = this.route.snapshot.queryParams['redirectTo'];
    this.loadCaptains();
  }

  async loadCaptains() {

    this.captains = (await this.playerService.getCaptains()).filter(p => p.correo).map(p => p.correo ?? '');
  }
}
