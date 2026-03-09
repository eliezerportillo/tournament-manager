import { Component, Inject, inject } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import {
  PlayerPendingService,
  IPendingPlayer,
  PendingStatus,
} from '@app-core/services/player-pending.service';
import { PlayerService } from '@app-core/services/player.service';
import { AccountService } from '@app-core/services/account.service';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';

interface PendingPlayerDetailData {
  pendingPlayer: IPendingPlayer;
}

interface PendingPlayerDetailResult {
  action: 'approved' | 'rejected' | 'cancelled';
  pendingPlayer: IPendingPlayer;
}

@Component({
  selector: 'app-pending-player-detail',
  templateUrl: './pending-player-detail.component.html',
  styleUrls: ['./pending-player-detail.component.scss'],
})
export class PendingPlayerDetailComponent {
  private bottomSheetRef = inject(
    MatBottomSheetRef<PendingPlayerDetailComponent>
  );
  private pendingService = inject(PlayerPendingService);
  private playerService = inject(PlayerService);
  private accountService = inject(AccountService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  pendingPlayer: IPendingPlayer;
  originalPlayer: any = null;
  currentUser: any = null;
  isLoading = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: PendingPlayerDetailData
  ) {
    this.pendingPlayer = data.pendingPlayer;
    this.loadAdditionalData();
  }

  private async loadAdditionalData(): Promise<void> {
    try {
      // Load current user for audit trail
      this.currentUser = await this.accountService.getCurrentUser();

      // If this is an update or deletion, load the original player
      if (
        this.pendingPlayer.originalPlayerId &&
        (this.pendingPlayer.pendingStatus === PendingStatus.PENDING_UPDATE ||
          this.pendingPlayer.pendingStatus === PendingStatus.PENDING_DELETION)
      ) {
        this.originalPlayer = await this.playerService.getPlayerById(
          this.pendingPlayer.originalPlayerId
        );
      }
    } catch (error) {
      console.error('Error loading additional data:', error);
      this.showErrorMessage('Error al cargar información adicional');
    }
  }

  /**
   * Approves the pending player request
   */
  async approvePlayer(): Promise<void> {
    if (!this.currentUser?.email) {
      this.showErrorMessage(
        'Error de autenticación. Por favor, inicie sesión nuevamente.'
      );
      return;
    }

    const confirmMessage = this.getApprovalConfirmationMessage();
    const confirmed = await this.showConfirmationDialog(
      'Confirmar Aprobación',
      confirmMessage,
      'Aprobar',
      'primary'
    );

    if (!confirmed) {
      return;
    }

    this.isLoading = true;

    try {
      switch (this.pendingPlayer.pendingStatus) {
        case PendingStatus.PENDING_CREATION:
          await this.pendingService.approvePendingCreation(
            this.pendingPlayer.id!,
            this.currentUser.email
          );
          break;

        case PendingStatus.PENDING_UPDATE:
          await this.pendingService.approvePendingUpdate(
            this.pendingPlayer.id!,
            this.currentUser.email
          );
          break;

        case PendingStatus.PENDING_DELETION:
          await this.pendingService.approvePendingDeletion(
            this.pendingPlayer.id!,
            this.currentUser.email
          );
          break;

        default:
          throw new Error('Estado de solicitud no válido para aprobación');
      }

      this.bottomSheetRef.dismiss({
        action: 'approved',
        pendingPlayer: this.pendingPlayer,
      } as PendingPlayerDetailResult);
    } catch (error: any) {
      console.error('Error approving player:', error);

      // Handle specific Firebase error for non-existent document
      if (
        error.code === 'not-found' ||
        error.message?.includes('no encontrada') ||
        error.message?.includes('No document to update')
      ) {
        this.showErrorMessage(
          'Esta solicitud ya fue procesada por otro administrador. La página se actualizará automáticamente.'
        );
        // Auto-close the dialog since the document no longer exists
        setTimeout(() => {
          this.bottomSheetRef.dismiss({
            action: 'approved',
            pendingPlayer: this.pendingPlayer,
          } as PendingPlayerDetailResult);
        }, 2000);
      } else {
        this.showErrorMessage(error.message || 'Error al aprobar la solicitud');
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Rejects the pending player request with a reason
   */
  async rejectPlayer(): Promise<void> {
    if (!this.currentUser?.email) {
      this.showErrorMessage(
        'Error de autenticación. Por favor, inicie sesión nuevamente.'
      );
      return;
    }

    // Ask for rejection reason
    const rejectionReason = await this.askForRejectionReason();
    if (!rejectionReason) {
      return; // User cancelled or didn't provide reason
    }

    const confirmMessage = `¿Está seguro de que desea rechazar esta solicitud para ${this.pendingPlayer.jugador}? Razón: ${rejectionReason}. La solicitud será marcada como rechazada.`;
    const confirmed = await this.showConfirmationDialog(
      'Confirmar Rechazo',
      confirmMessage,
      'Rechazar',
      'warn'
    );

    if (!confirmed) {
      return;
    }

    this.isLoading = true;

    try {
      // Include the admin email in the rejection reason
      const fullRejectionReason = `${rejectionReason} - Rechazado por: ${this.currentUser.email}`;

      console.log('🚀 Component: Starting rejection with data:', {
        pendingPlayerId: this.pendingPlayer.id,
        playerName: this.pendingPlayer.jugador,
        playerTeam: this.pendingPlayer.equipo,
        pendingStatus: this.pendingPlayer.pendingStatus,
        originalPlayerId: this.pendingPlayer.originalPlayerId,
        adminEmail: this.currentUser.email,
        idType: typeof this.pendingPlayer.id,
        idLength: this.pendingPlayer.id?.length,
      });

      if (!this.pendingPlayer.id) {
        console.error(
          '❌ Component: pendingPlayer.id is missing!',
          this.pendingPlayer
        );
        this.showErrorMessage('Error: ID de solicitud pendiente no encontrado');
        return;
      }

      await this.pendingService.rejectPendingPlayer(
        this.pendingPlayer.id!,
        fullRejectionReason,
        this.currentUser.email
      );

      this.bottomSheetRef.dismiss({
        action: 'rejected',
        pendingPlayer: this.pendingPlayer,
      } as PendingPlayerDetailResult);
    } catch (error: any) {
      console.error('Error rejecting player:', error);

      // Handle specific Firebase error for non-existent document
      if (
        error.code === 'not-found' ||
        error.message?.includes('No document to update')
      ) {
        this.showErrorMessage(
          'Esta solicitud ya fue procesada por otro administrador. La página se actualizará automáticamente.'
        );
        // Auto-close the dialog since the document no longer exists
        setTimeout(() => {
          this.bottomSheetRef.dismiss({
            action: 'rejected',
            pendingPlayer: this.pendingPlayer,
          } as PendingPlayerDetailResult);
        }, 2000);
      } else {
        this.showErrorMessage(
          error.message || 'Error al rechazar la solicitud'
        );
      }
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Closes the detail without action
   */
  close(): void {
    this.bottomSheetRef.dismiss({
      action: 'cancelled',
      pendingPlayer: this.pendingPlayer,
    } as PendingPlayerDetailResult);
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
      case PendingStatus.UNDER_REVIEW:
        return 'En Revisión';
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
      case PendingStatus.UNDER_REVIEW:
        return 'visibility';
      case PendingStatus.REJECTED:
        return 'block';
      default:
        return 'help';
    }
  }

  /**
   * Gets Material color for pending status
   */
  getPendingStatusColor(status: PendingStatus): string {
    switch (status) {
      case PendingStatus.PENDING_CREATION:
        return 'primary';
      case PendingStatus.PENDING_UPDATE:
        return 'accent';
      case PendingStatus.PENDING_DELETION:
        return 'warn';
      case PendingStatus.UNDER_REVIEW:
        return 'primary';
      case PendingStatus.REJECTED:
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

  /**
   * Gets the appropriate action button text based on status
   */
  getApprovalButtonText(): string {
    switch (this.pendingPlayer.pendingStatus) {
      case PendingStatus.PENDING_CREATION:
        return 'Aprobar alta';
      case PendingStatus.PENDING_UPDATE:
        return 'Aprobar cambios';
      case PendingStatus.PENDING_DELETION:
        return 'Eliminar Jugador';
      default:
        return 'Aprobar';
    }
  }

  /**
   * Determines if actions should be disabled
   */
  areActionsDisabled(): boolean {
    return (
      this.isLoading ||
      this.pendingPlayer.pendingStatus === PendingStatus.REJECTED
    );
  }

  private getApprovalConfirmationMessage(): string {
    switch (this.pendingPlayer.pendingStatus) {
      case PendingStatus.PENDING_CREATION:
        return `¿Confirmar la creación del jugador ${this.pendingPlayer.jugador} en el equipo ${this.pendingPlayer.equipo}? Esto creará un nuevo jugador en el sistema.`;

      case PendingStatus.PENDING_UPDATE:
        return `¿Confirmar la actualización de datos para ${this.pendingPlayer.jugador}? Esto sobrescribirá los datos actuales del jugador.`;

      case PendingStatus.PENDING_DELETION:
        return `¿Confirmar la eliminación del jugador ${this.pendingPlayer.jugador}? El jugador será marcado como INACTIVO en el sistema.`;

      default:
        return `¿Confirmar aprobación de la solicitud para ${this.pendingPlayer.jugador}?`;
    }
  }

  private async showConfirmationDialog(
    title: string,
    message: string,
    confirmButtonText: string,
    confirmButtonColor: 'primary' | 'accent' | 'warn'
  ): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title,
        message,
        confirmButtonText,
        confirmButtonColor,
        cancelButtonText: 'Cancelar',
      },
    });

    const result = await dialogRef.afterClosed().toPromise();
    return result === true;
  }

  /**
   * Shows a dialog to ask for rejection reason
   */
  private async askForRejectionReason(): Promise<string | null> {
    return new Promise((resolve) => {
      // Create a simple HTML input dialog using MatDialog
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '500px',
        data: {
          title: 'Motivo de Rechazo',
          message: `¿Por qué está rechazando la solicitud de ${this.pendingPlayer.jugador}? Por favor proporcione una razón específica:`,
          confirmButtonText: 'Rechazar con esta razón',
          confirmButtonColor: 'warn' as const,
          cancelButtonText: 'Cancelar',
          showTextArea: true,
          textAreaPlaceholder: 'Escriba el motivo del rechazo...',
          textAreaRequired: true,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (
          result &&
          typeof result === 'object' &&
          result.confirmed &&
          result.textValue
        ) {
          resolve(result.textValue.trim());
        } else {
          resolve(null);
        }
      });
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
