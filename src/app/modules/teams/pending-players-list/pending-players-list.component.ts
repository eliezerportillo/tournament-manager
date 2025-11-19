import { Component, OnInit, inject } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';

import {
  PlayerPendingService,
  IPendingPlayer,
  PendingStatus,
} from '@app-core/services/player-pending.service';
import { PendingPlayerDetailComponent } from '../pending-player-detail/pending-player-detail.component';

interface PendingPlayerSummary {
  totalPending: number;
  pendingCreation: number;
  pendingUpdate: number;
  pendingDeletion: number;
  rejected: number;
}

@Component({
  selector: 'app-pending-players-list',
  templateUrl: './pending-players-list.component.html',
  styleUrls: ['./pending-players-list.component.scss'],
})
export class PendingPlayersListComponent implements OnInit {
  private pendingService = inject(PlayerPendingService);
  private bottomSheet = inject(MatBottomSheet);
  private snackBar = inject(MatSnackBar);

  pendingPlayers$: Observable<IPendingPlayer[]> | null = null;
  activePendingPlayers$: Observable<IPendingPlayer[]> | null = null;
  rejectedPendingPlayers$: Observable<IPendingPlayer[]> | null = null;
  pendingSummary$: Observable<PendingPlayerSummary> | null = null;

  // Filter options
  selectedStatus: PendingStatus | 'all' = 'all';
  selectedTeam: string = 'all';

  statusOptions = [
    { value: 'all', label: 'Todos', icon: 'list' },
    {
      value: PendingStatus.PENDING_CREATION,
      label: 'Pendientes de Alta',
      icon: 'person_add',
    },
    {
      value: PendingStatus.PENDING_UPDATE,
      label: 'Pendientes de Actualización',
      icon: 'edit',
    },
    {
      value: PendingStatus.PENDING_DELETION,
      label: 'Pendientes de Baja',
      icon: 'person_remove',
    },
    {
      value: PendingStatus.REJECTED,
      label: 'Rechazados',
      icon: 'block',
    },
  ];

  teamOptions: { value: string; label: string; icon: string }[] = [
    { value: 'all', label: 'Todos los Equipos', icon: 'groups' },
  ];

  ngOnInit(): void {
    this.loadPendingPlayers();
  }

  private loadPendingPlayers(): void {
    // Load all pending players
    const allPending$ = this.pendingService.getAllPendingPlayers();

    // Build team options from available data
    allPending$
      .pipe(
        map((players) => {
          const uniqueTeams = [...new Set(players.map((p) => p.equipo))].sort();
          this.teamOptions = [
            { value: 'all', label: 'Todos los Equipos', icon: 'groups' },
            ...uniqueTeams.map((team) => ({
              value: team,
              label: team,
              icon: 'group',
            })),
          ];
        })
      )
      .subscribe();

    // Filter by selected status and team
    this.pendingPlayers$ = allPending$.pipe(
      map((players) => {
        let filteredPlayers = players;

        // Filter by status
        if (this.selectedStatus !== 'all') {
          filteredPlayers = filteredPlayers.filter(
            (p) => p.pendingStatus === this.selectedStatus
          );
        }

        // Filter by team
        if (this.selectedTeam !== 'all') {
          filteredPlayers = filteredPlayers.filter(
            (p) => p.equipo === this.selectedTeam
          );
        }

        return filteredPlayers;
      })
    );

    // Create separate streams for active and rejected requests for better UX
    this.activePendingPlayers$ = allPending$.pipe(
      map((players) => {
        let filteredPlayers = players.filter(
          (p) => p.pendingStatus !== 'rejected'
        );

        // Apply filters only if not showing all
        if (
          this.selectedStatus !== 'all' &&
          this.selectedStatus !== 'rejected'
        ) {
          filteredPlayers = filteredPlayers.filter(
            (p) => p.pendingStatus === this.selectedStatus
          );
        }

        if (this.selectedTeam !== 'all') {
          filteredPlayers = filteredPlayers.filter(
            (p) => p.equipo === this.selectedTeam
          );
        }

        // Sort by status priority: pending_creation, pending_update, pending_deletion, under_review
        return filteredPlayers.sort((a, b) => {
          const statusOrder: { [key: string]: number } = {
            pending_creation: 1,
            pending_update: 2,
            pending_deletion: 3,
            under_review: 4,
          };
          const aOrder = statusOrder[a.pendingStatus as string] || 5;
          const bOrder = statusOrder[b.pendingStatus as string] || 5;
          return aOrder - bOrder;
        });
      })
    );

    this.rejectedPendingPlayers$ = allPending$.pipe(
      map((players) => {
        let filteredPlayers = players.filter(
          (p) => p.pendingStatus === 'rejected'
        );

        if (this.selectedTeam !== 'all') {
          filteredPlayers = filteredPlayers.filter(
            (p) => p.equipo === this.selectedTeam
          );
        }

        // Sort rejected by most recent first
        return filteredPlayers.sort((a, b) => {
          const aTime = this.convertTimestampToDate(
            a.reviewedAt || a.requestedAt || 0
          ).getTime();
          const bTime = this.convertTimestampToDate(
            b.reviewedAt || b.requestedAt || 0
          ).getTime();
          return bTime - aTime;
        });
      })
    );

    // Calculate summary statistics
    this.pendingSummary$ = allPending$.pipe(
      map((players) => {
        const summary: PendingPlayerSummary = {
          totalPending: players.filter((p) => p.pendingStatus !== 'rejected')
            .length,
          pendingCreation: players.filter(
            (p) => p.pendingStatus === PendingStatus.PENDING_CREATION
          ).length,
          pendingUpdate: players.filter(
            (p) => p.pendingStatus === PendingStatus.PENDING_UPDATE
          ).length,
          pendingDeletion: players.filter(
            (p) => p.pendingStatus === PendingStatus.PENDING_DELETION
          ).length,
          rejected: players.filter(
            (p) => p.pendingStatus === PendingStatus.REJECTED
          ).length,
        };
        return summary;
      })
    );
  }

  /**
   * Handles filter changes (status and team)
   */
  onFilterChange(): void {
    this.loadPendingPlayers();
  }

  /**
   * Opens pending player detail for review
   */
  async reviewPlayer(pendingPlayer: IPendingPlayer): Promise<void> {
    const bottomSheetRef = this.bottomSheet.open(PendingPlayerDetailComponent, {
      data: { pendingPlayer },
      disableClose: true,
      panelClass: 'pending-player-detail-bottom-sheet',
    });

    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result?.action === 'approved' || result?.action === 'rejected') {
        // Refresh data after action
        this.loadPendingPlayers();
        this.showActionMessage(result.action, pendingPlayer.jugador);
      }
    });
  }

  /**
   * Gets display text for pending status
   */
  getPendingStatusText(status: PendingStatus): string {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return 'Alta';
      case PendingStatus.PENDING_UPDATE:
        return 'Modificación';
      case PendingStatus.PENDING_DELETION:
        return 'Baja';
      case PendingStatus.REJECTED:
        return 'Rechazado';
      default:
        return 'Estado Desconocido';
    }
  }

  /**
   * Gets Material icon for pending status
   */
  getPendingStatusIcon(status: PendingStatus): string {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return 'person_add';
      case PendingStatus.PENDING_UPDATE:
        return 'edit';
      case PendingStatus.PENDING_DELETION:
        return 'person_remove';
      case PendingStatus.REJECTED:
        return 'block';
      default:
        return 'help';
    }
  }

  /**
   * Gets Material color for pending status to match dashboard summary cards
   */
  getPendingStatusColor(status: PendingStatus): string {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return ''; // Will use CSS class instead
      case PendingStatus.PENDING_UPDATE:
        return 'accent'; // Material accent color - matches "Actualizaciones"
      case PendingStatus.PENDING_DELETION:
        return 'warn'; // Material warn color - matches "Bajas"
      case PendingStatus.REJECTED:
        return 'warn'; // Material warn color - matches "Rechazados"
      default:
        return 'primary'; // Default to primary color
    }
  }

  /**
   * Gets Material chip color for pending status
   */
  getPendingChipColor(
    status: PendingStatus
  ): 'primary' | 'accent' | 'warn' | undefined {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return 'accent'; // Green-ish color for new creations
      case PendingStatus.PENDING_UPDATE:
        return 'primary'; // Blue color for updates
      case PendingStatus.PENDING_DELETION:
        return 'warn'; // Red color for deletions
      case PendingStatus.REJECTED:
        return 'warn'; // Red color for rejected
      default:
        return undefined; // Default chip color
    }
  }

  /**
   * Gets CSS class for pending status icons to match dashboard summary cards
   */
  getPendingStatusClass(status: PendingStatus): string {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return 'success-color'; // CSS class for success color (green) - matches "Nuevos Jugadores"
      default:
        return ''; // No additional CSS class needed
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

  /**
   * Gets captain name who requested the change
   */
  getRequestedBy(pendingPlayer: IPendingPlayer): string {
    return pendingPlayer.requestedBy || 'Desconocido';
  }

  private showActionMessage(action: string, playerName: string): void {
    const message =
      action === 'approved'
        ? `Jugador ${playerName} aprobado correctamente`
        : `Solicitud de ${playerName} rechazada`;

    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass:
        action === 'approved' ? ['success-snackbar'] : ['warn-snackbar'],
    });
  }
}
