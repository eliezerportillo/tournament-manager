import { Injectable, inject } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IPlayer, Player } from '@app-core/models/player';
import { PlayerService } from '@app-core/services/player.service';
import {
  PlayerPendingService,
  IPendingPlayer,
  PendingStatus,
} from '@app-core/services/player-pending.service';
import { AccountService } from '@app-core/services/account.service';

/**
 * Strategy pattern implementation for captain-specific player operations
 * Handles the pending workflow for player management by team captains
 */
@Injectable({
  providedIn: 'root',
})
export class CaptainPlayerStrategy {
  private playerService = inject(PlayerService);
  private playerPendingService = inject(PlayerPendingService);
  private accountService = inject(AccountService);
  private snackBar = inject(MatSnackBar);

  /**
   * Creates a new player registration request
   */
  async createPlayer(playerData: IPlayer): Promise<void> {
    const currentUser = await this.accountService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('Usuario no autenticado');
    }

    // Validate captain permissions for this team
    await this.validateCaptainPermissions(currentUser.email, playerData.equipo);

    // Create pending player request
    await this.playerPendingService.createPendingPlayer(
      playerData,
      currentUser.email
    );

    this.showSuccessMessage(
      `Solicitud de registro enviada para ${playerData.jugador}. Pendiente de aprobación por administrador.`
    );
  }

  /**
   * Creates an update request for existing player
   */
  async updatePlayer(
    playerId: string,
    updates: Partial<IPlayer>
  ): Promise<void> {
    const currentUser = await this.accountService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('Usuario no autenticado');
    }

    // Get existing player to validate team
    const existingPlayer = await this.playerService.getPlayerById(playerId);
    if (!existingPlayer) {
      throw new Error('Jugador no encontrado');
    }

    // Validate captain permissions
    await this.validateCaptainPermissions(
      currentUser.email,
      existingPlayer.equipo
    );

    // Create pending update request
    await this.playerPendingService.createPendingUpdate(
      playerId,
      updates,
      currentUser.email
    );

    this.showSuccessMessage(
      `Solicitud de actualización enviada para ${existingPlayer.jugador}. Pendiente de aprobación.`
    );
  }

  /**
   * Creates a deletion request for existing player
   */
  async deletePlayer(playerId: string): Promise<void> {
    const currentUser = await this.accountService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('Usuario no autenticado');
    }

    // Get existing player to validate team
    const existingPlayer = await this.playerService.getPlayerById(playerId);
    if (!existingPlayer) {
      throw new Error('Jugador no encontrado');
    }

    // Validate captain permissions
    await this.validateCaptainPermissions(
      currentUser.email,
      existingPlayer.equipo
    );

    // Create pending deletion request
    await this.playerPendingService.createPendingDeletion(
      playerId,
      existingPlayer,
      currentUser.email
    );

    this.showSuccessMessage(
      `Solicitud de eliminación enviada para ${existingPlayer.jugador}. Pendiente de aprobación.`
    );
  }

  /**
   * Updates an existing pending player request
   */
  async updatePendingPlayer(
    pendingId: string,
    updates: Partial<IPlayer>
  ): Promise<void> {
    const currentUser = await this.accountService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('Usuario no autenticado');
    }

    // Get existing pending player to validate permissions
    const existingPending =
      await this.playerPendingService.getPendingPlayerById(pendingId);
    if (!existingPending) {
      throw new Error('Solicitud pendiente no encontrada');
    }

    // Validate captain permissions
    await this.validateCaptainPermissions(
      currentUser.email,
      existingPending.equipo
    );

    // Validate captain is the original requester
    if (existingPending.requestedBy !== currentUser.email) {
      throw new Error('Solo puedes editar tus propias solicitudes');
    }

    // Update the pending player record
    await this.playerPendingService.updatePendingPlayer(
      pendingId,
      updates,
      currentUser.email
    );

    this.showSuccessMessage(
      `Solicitud actualizada para ${
        updates.jugador || existingPending.jugador
      }. Pendiente de aprobación.`
    );
  }

  /**
   * Gets pending requests for captain's team
   */
  getPendingRequestsForTeam(teamName: string): Observable<IPendingPlayer[]> {
    return this.playerPendingService.getPendingPlayersByTeam(teamName);
  }

  /**
   * Gets all players for captain's team (active only)
   */
  getTeamPlayers(teamName: string): Observable<IPlayer[]> {
    return this.playerService.getPlayersByTeam(teamName);
  }

  /**
   * Cancels a pending request (only if captain is the requester)
   */
  async cancelPendingRequest(pendingId: string): Promise<void> {
    const currentUser = await this.accountService.getCurrentUser();
    if (!currentUser?.email) {
      throw new Error('Usuario no autenticado');
    }

    // Get pending request
    const pendingPlayer = await this.playerPendingService.getPendingPlayerById(
      pendingId
    );
    if (!pendingPlayer) {
      throw new Error('Solicitud no encontrada');
    }

    // Validate captain is the requester
    if (pendingPlayer.requestedBy !== currentUser.email) {
      throw new Error('Solo puedes cancelar tus propias solicitudes');
    }

    // Cannot cancel if under review
    if (pendingPlayer.pendingStatus === PendingStatus.UNDER_REVIEW) {
      throw new Error(
        'No se puede cancelar una solicitud que está siendo revisada'
      );
    }

    // Delete pending request
    await this.playerPendingService.deletePendingPlayer(pendingId);

    this.showSuccessMessage('Solicitud cancelada exitosamente');
  }

  /**
   * Validates if user is captain of the specified team
   */
  private async validateCaptainPermissions(
    userEmail: string,
    teamName: string
  ): Promise<void> {
    const captain = await this.playerService.getPlayerByEmail(userEmail);

    if (!captain) {
      throw new Error('No se encontró tu registro como jugador');
    }

    if (captain.equipo !== teamName) {
      throw new Error(
        'No tienes permisos para gestionar jugadores de este equipo'
      );
    }

    if (!Player.isCaptain(captain)) {
      throw new Error(
        'Solo los capitanes pueden gestionar jugadores del equipo'
      );
    }
  }

  /**
   * Checks if a player number is available for use in a team
   */
  async isPlayerNumberAvailable(
    teamName: string,
    numero: string,
    playerName?: string
  ): Promise<boolean> {
    return this.playerPendingService.isPlayerNumberUnique(
      teamName,
      numero,
      playerName
    );
  }

  /**
   * Gets captain's team information
   */
  async getCaptainTeam(captainEmail: string): Promise<IPlayer | null> {
    return this.playerService.getPlayerByEmail(captainEmail);
  }

  /**
   * Gets summary statistics for captain's team management
   */
  async getTeamManagementSummary(teamName: string): Promise<{
    totalPlayers: number;
    pendingRequests: number;
    underReview: number;
  }> {
    const [allPlayers, pendingPlayers] = await Promise.all([
      firstValueFrom(this.getTeamPlayers(teamName)),
      firstValueFrom(this.getPendingRequestsForTeam(teamName)),
    ]);

    const underReview = pendingPlayers.filter(
      (p) => p.pendingStatus === PendingStatus.UNDER_REVIEW
    ).length;

    return {
      totalPlayers: allPlayers.length,
      pendingRequests: pendingPlayers.length,
      underReview,
    };
  }

  /**
   * Validates player data before submission
   */
  async validatePlayerData(
    playerData: Partial<IPlayer>,
    teamName: string
  ): Promise<string[]> {
    const errors: string[] = [];

    // Required fields validation
    if (!playerData.jugador?.trim()) {
      errors.push('El nombre del jugador es obligatorio');
    }

    if (!playerData.numero?.trim()) {
      errors.push('El número de camiseta es obligatorio');
    }

    if (!playerData.celular?.trim()) {
      errors.push('El número de celular es obligatorio');
    }

    // Business rules validation
    if (playerData.numero) {
      const isUnique = await this.isPlayerNumberAvailable(
        teamName,
        playerData.numero
      );
      if (!isUnique) {
        errors.push(`El número ${playerData.numero} ya está en uso`);
      }
    }

    // Age validation
    if (playerData.dateBirth) {
      const age = this.calculateAge(playerData.dateBirth);
      if (age < 16) {
        errors.push('El jugador debe tener al menos 16 años');
      }
      if (age > 50) {
        errors.push(
          'Verifica la fecha de nacimiento, la edad parece incorrecta'
        );
      }
    }

    return errors;
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }

  /**
   * Shows success message to user
   */
  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  /**
   * Shows error message to user
   */
  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}
