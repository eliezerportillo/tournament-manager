import { Component, OnInit, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PlayerService } from '@app-core/services/player.service';
import { AccountService } from '@app-core/services/account.service';
import { BadgeService } from '@app-core/services/badge.service';
import { IPlayer } from '@app-core/models/player';
import { IBadge } from '@app-core/models/bagde';
import { IPendingPlayer } from '@app-core/services/player-pending.service';
import { CaptainPlayerStrategy } from '@app-core/strategies/captain-player.strategy';
import {
  PlayerFormComponent,
  PlayerFormData,
  PlayerFormResult,
} from '../../teams/player-form/player-form.component';

@Component({
  selector: 'app-my-team-management',
  templateUrl: './my-team-management.component.html',
  styleUrls: ['./my-team-management.component.scss'],
})
export class MyTeamManagementComponent implements OnInit {
  private playerService = inject(PlayerService);
  private accountService = inject(AccountService);
  private badgeService = inject(BadgeService);
  private bottomSheet = inject(MatBottomSheet);
  private snackBar = inject(MatSnackBar);
  private captainStrategy = inject(CaptainPlayerStrategy);

  captain: IPlayer | null = null;
  teamPlayers: IPlayer[] = [];
  pendingPlayers: IPendingPlayer[] = [];
  teamBadges: IBadge[] = [];
  teamPlayers$: Observable<IPlayer[]> | null = null;
  pendingPlayers$: Observable<IPendingPlayer[]> | null = null;
  playersWithBadgeInfo$: Observable<any[]> | null = null;
  managementSummary: {
    totalPlayers: number;
    pendingRequests: number;
    playersWithPhotos: number;
    playersWithoutPhotos: number;
  } | null = null;

  async ngOnInit() {
    await this.loadCaptainInfo();
    if (this.captain) {
      await this.loadTeamData();
    }
  }

  private async loadCaptainInfo() {
    try {
      const currentUser = await this.accountService.getCurrentUser();
      if (currentUser?.email) {
        this.captain = await this.playerService.getPlayerByEmail(
          currentUser.email
        );
      }
    } catch (error) {
      console.error('Error loading captain info:', error);
      this.showErrorMessage('Error al cargar información del capitán');
    }
  }

  private async loadTeamData() {
    try {
      if (this.captain) {
        // Load team players and pending requests
        this.teamPlayers$ = this.captainStrategy.getTeamPlayers(
          this.captain.equipo
        );
        this.pendingPlayers$ = this.captainStrategy.getPendingRequestsForTeam(
          this.captain.equipo
        );

        // Load team badges
        const teamBadges$ = this.badgeService.get((ref) =>
          ref.where('teamName', '==', this.captain!.equipo)
        );

        // Combine players with badge information
        this.playersWithBadgeInfo$ = combineLatest([
          this.teamPlayers$,
          teamBadges$,
        ]).pipe(
          map(([players, badges]: [IPlayer[], IBadge[]]) => {
            console.log('🖼️ Combining players with badges:', {
              players: players.length,
              badges: badges.length,
            });
            return players.map((player: IPlayer) => {
              const badge = badges.find(
                (b: IBadge) =>
                  b.playerName.trim().toUpperCase() ===
                  player.jugador.trim().toUpperCase()
              );
              const playerWithBadge = {
                ...player,
                hasPhoto: !!badge,
                photoUrl: badge?.photoUrl || null,
                badge: badge || null,
              };

              if (badge) {
                console.log(
                  `📸 Found badge for ${player.jugador}: ${badge.photoUrl}`
                );
              }

              return playerWithBadge;
            });
          })
        );

        // Calculate management summary with photo statistics
        combineLatest([this.teamPlayers$, teamBadges$, this.pendingPlayers$])
          .pipe(
            map(
              ([players, badges, pending]: [
                IPlayer[],
                IBadge[],
                IPendingPlayer[]
              ]) => {
                // Filter only active players (exclude INACTIVO players)
                const activePlayers = players.filter(
                  (player) => !this.isPlayerInactive(player)
                );

                const playersWithPhotos = activePlayers.filter((player) =>
                  badges.some(
                    (badge) =>
                      badge.playerName.trim().toUpperCase() ===
                      player.jugador.trim().toUpperCase()
                  )
                ).length;

                return {
                  totalPlayers: activePlayers.length,
                  pendingRequests: pending.length,
                  playersWithPhotos,
                  playersWithoutPhotos:
                    activePlayers.length - playersWithPhotos,
                };
              }
            )
          )
          .subscribe((summary) => {
            this.managementSummary = summary;
          });
      }
    } catch (error) {
      console.error('Error loading team data:', error);
      this.showErrorMessage('Error al cargar datos del equipo');
    }
  }

  /**
   * Opens the player registration form
   */
  async registerNewPlayer() {
    if (!this.captain) {
      this.showErrorMessage('No se pudo verificar la información del capitán');
      return;
    }

    const formData: PlayerFormData = {
      teamName: this.captain.equipo,
      mode: 'create',
    };

    const bottomSheetRef = this.bottomSheet.open(PlayerFormComponent, {
      data: formData,
      disableClose: true,
      panelClass: 'player-form-bottom-sheet',
    });

    bottomSheetRef
      .afterDismissed()
      .subscribe((result: PlayerFormResult | undefined) => {
        if (result?.action === 'save' || result?.action === 'delete') {
          // Refresh data after successful registration, update or deletion request
          this.loadTeamData();
        }
      });
  }

  /**
   * Opens the player edit form
   */
  async editPlayer(player: IPlayer) {
    if (!this.captain) {
      this.showErrorMessage('No se pudo verificar la información del capitán');
      return;
    }

    const formData: PlayerFormData = {
      teamName: this.captain.equipo,
      mode: 'edit',
      player,
    };

    const bottomSheetRef = this.bottomSheet.open(PlayerFormComponent, {
      data: formData,
      disableClose: true,
      panelClass: 'player-form-bottom-sheet',
    });

    bottomSheetRef
      .afterDismissed()
      .subscribe((result: PlayerFormResult | undefined) => {
        if (result?.action === 'save' || result?.action === 'delete') {
          // Refresh data after successful update or deletion request
          this.loadTeamData();
        }
      });
  }

  /**
   * Opens the player edit form for a pending player
   */
  async editPendingPlayer(pendingPlayer: IPendingPlayer) {
    if (!this.captain) {
      this.showErrorMessage('No se pudo verificar la información del capitán');
      return;
    }

    // Convert IPendingPlayer to IPlayer for the form
    console.log('Original pending player data:', pendingPlayer);
    console.log('pendingPlayer.dateBirth:', pendingPlayer.dateBirth);
    console.log(
      'pendingPlayer.fechaNacimiento:',
      pendingPlayer.fechaNacimiento
    );

    const playerForEdit: IPlayer = {
      ...pendingPlayer,
      // Remove pending-specific fields for the form
    };
    delete (playerForEdit as any).pendingStatus;
    delete (playerForEdit as any).originalPlayerId;
    delete (playerForEdit as any).requestedBy;
    delete (playerForEdit as any).requestedAt;
    delete (playerForEdit as any).reviewedBy;
    delete (playerForEdit as any).reviewedAt;

    console.log('Converted player for edit:', playerForEdit);
    console.log('playerForEdit.dateBirth:', playerForEdit.dateBirth);
    console.log(
      'playerForEdit.fechaNacimiento:',
      playerForEdit.fechaNacimiento
    );

    const formData: PlayerFormData = {
      teamName: this.captain.equipo,
      mode: 'edit',
      player: playerForEdit,
      pendingPlayerId: pendingPlayer.id, // Pass the pending player ID
    };

    const bottomSheetRef = this.bottomSheet.open(PlayerFormComponent, {
      data: formData,
      disableClose: true,
      panelClass: 'player-form-bottom-sheet',
    });

    bottomSheetRef
      .afterDismissed()
      .subscribe((result: PlayerFormResult | undefined) => {
        if (result?.action === 'save' || result?.action === 'delete') {
          // Refresh data after successful update or deletion request
          this.loadTeamData();
        }
      });
  }

  /**
   * Cancels a pending request
   */
  async cancelPendingRequest(pendingPlayer: IPendingPlayer) {
    try {
      if (!pendingPlayer.id) {
        this.showErrorMessage('ID de solicitud no válido');
        return;
      }

      await this.captainStrategy.cancelPendingRequest(pendingPlayer.id);
      // Refresh data after cancellation
      this.loadTeamData();
    } catch (error: any) {
      console.error('Error canceling pending request:', error);
      this.showErrorMessage(error.message || 'Error al cancelar la solicitud');
    }
  }

  /**
   * Gets display text for pending status
   */
  getPendingStatusText(status: string): string {
    switch (status) {
      case 'pending_creation':
        return 'Pendiente de Alta';
      case 'pending_update':
        return 'Pendiente de Actualización';
      case 'pending_deletion':
        return 'Pendiente de Baja';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Estado Desconocido';
    }
  }

  /**
   * Gets CSS class for pending status (legacy support)
   */
  getPendingStatusClass(status: string): string {
    switch (status) {
      case 'pending_creation':
        return 'status-pending-creation';
      case 'pending_update':
        return 'status-pending-update';
      case 'pending_deletion':
        return 'status-pending-deletion';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-unknown';
    }
  }

  /**
   * Gets Material icon for pending status
   */
  getPendingStatusIcon(status: string): string {
    switch (status) {
      case 'pending_creation':
        return 'person_add';
      case 'pending_update':
        return 'edit';
      case 'pending_deletion':
        return 'person_remove';
      case 'rejected':
        return 'block';
      default:
        return 'help';
    }
  }

  /**
   * Gets Material color for pending status icons
   */
  getPendingStatusColor(status: string): string {
    switch (status) {
      case 'pending_creation':
        return 'primary';
      case 'pending_update':
        return 'accent';
      case 'pending_deletion':
        return 'warn';
      case 'rejected':
        return 'warn';
      default:
        return '';
    }
  }

  /**
   * Gets Material chip color for pending status
   */
  getPendingChipColor(status: string): string {
    switch (status) {
      case 'pending_creation':
      case 'pending_update':
        return 'primary';
      case 'pending_deletion':
      case 'rejected':
        return 'warn';
      default:
        return '';
    }
  }

  /**
   * Converts Firestore Timestamp to Date for pipe usage
   */
  convertTimestampToDate(timestamp: any): Date {
    if (!timestamp) {
      return new Date();
    }

    // If it's already a Date, return it
    if (timestamp instanceof Date) {
      return timestamp;
    }

    // If it's a Firestore Timestamp, convert using toDate()
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }

    // If it's a number (Unix timestamp), convert
    if (typeof timestamp === 'number') {
      return new Date(timestamp);
    }

    // Fallback: try to create a Date directly
    return new Date(timestamp);
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Gets the appropriate icon for a player based on their characteristics
   */
  getPlayerIcon(player: IPlayer): string {
    // Priority: Captain > Goalkeeper > Regular player
    if (player.capitan) {
      return 'military_tech';
    }
    if (player.portero) {
      return 'sports_handball';
    }
    return 'person';
  }

  /**
   * Gets the appropriate color for a player icon
   */
  getPlayerIconColor(player: IPlayer): string {
    if (player.capitan) {
      return 'warn'; // Golden/orange for captain
    }
    if (player.portero) {
      return 'accent'; // Purple for goalkeeper
    }
    return 'primary'; // Blue for regular player
  }

  /**
   * Gets a text description of player characteristics
   */
  getPlayerCharacteristics(player: IPlayer): string {
    const characteristics: string[] = [];

    if (player.capitan) {
      characteristics.push('Capitán');
    }
    if (player.portero) {
      characteristics.push('Portero');
    }
    if (player.noBautizado) {
      characteristics.push('No bautizado');
    }
    if (player.otraDenominacion) {
      characteristics.push('Otra denominación');
    }

    return characteristics.join(' • ');
  }

  /**
   * Gets the appropriate icon for a pending player based on their characteristics
   */
  getPendingPlayerIcon(pendingPlayer: IPendingPlayer): string {
    if (pendingPlayer.capitan) {
      return 'military_tech';
    }
    if (pendingPlayer.portero) {
      return 'sports_handball';
    }
    return 'person_outline'; // Use outline version for pending
  }

  /**
   * Gets the appropriate color for a pending player icon
   */
  getPendingPlayerIconColor(pendingPlayer: IPendingPlayer): string {
    if (pendingPlayer.capitan) {
      return 'warn';
    }
    if (pendingPlayer.portero) {
      return 'accent';
    }
    return 'primary';
  }

  /**
   * Gets a text description of pending player characteristics
   */
  getPendingPlayerCharacteristics(pendingPlayer: IPendingPlayer): string {
    const characteristics: string[] = [];

    if (pendingPlayer.capitan) {
      characteristics.push('Capitán');
    }
    if (pendingPlayer.portero) {
      characteristics.push('Portero');
    }
    if (pendingPlayer.noBautizado) {
      characteristics.push('No bautizado');
    }
    if (pendingPlayer.otraDenominacion) {
      characteristics.push('Otra denominación');
    }

    return characteristics.join(' • ');
  }

  /**
   * Check if a player is inactive
   */
  isPlayerInactive(player: any): boolean {
    if (!player.status) return false;
    return String(player.status).trim().toUpperCase() === 'INACTIVO';
  }
}
