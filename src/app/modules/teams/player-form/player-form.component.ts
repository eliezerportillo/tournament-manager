import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { IPlayer } from '@app-core/models/player';
import { PlayerPendingService } from '@app-core/services/player-pending.service';
import { AccountService } from '@app-core/services/account.service';
import { CaptainPlayerStrategy } from '@app-core/strategies/captain-player.strategy';
import { ConfirmationDialogComponent } from '@app-shared/confirmation-dialog/confirmation-dialog.component';
import {
  uniquePlayerNumberValidator,
  phoneValidator,
  ageWarningValidator,
  playerNameValidator,
  getCustomValidatorErrorMessage,
  isValidationWarning,
} from '@app-shared/validators/player-validators';
import {
  formDateToPlayerDate,
  stringToDate,
  playerDateToFormDate,
} from '@app-shared/utils/date-conversion.utils';

export interface PlayerFormData {
  teamName: string;
  mode: 'create' | 'edit';
  player?: IPlayer; // For edit mode
  pendingPlayerId?: string; // For editing pending players
}

export interface PlayerFormResult {
  action: 'save' | 'cancel' | 'delete';
  player?: IPlayer;
}

@Component({
  selector: 'app-player-form',
  templateUrl: './player-form.component.html',
  styleUrls: ['./player-form.component.scss'],
})
export class PlayerFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private playerPendingService = inject(PlayerPendingService);
  private accountService = inject(AccountService);
  private captainStrategy = inject(CaptainPlayerStrategy);

  playerForm!: FormGroup;
  isLoading = false;
  isEditMode = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: PlayerFormData,
    private bottomSheetRef: MatBottomSheetRef<
      PlayerFormComponent,
      PlayerFormResult
    >
  ) {
    this.isEditMode = data.mode === 'edit';
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    // Safe date conversion with error handling
    let birthDateValue = '';
    if (this.data.player) {
      try {
        console.log(
          'PlayerFormComponent - initializing with player data:',
          this.data.player
        );
        console.log('Player dateBirth:', this.data.player.dateBirth);
        console.log(
          'Player fechaNacimiento:',
          this.data.player.fechaNacimiento
        );
        console.log('Is editing pending player?', !!this.data.pendingPlayerId);

        console.log('Player data:', this.data.player);
        console.log(
          'otraDenominacion value:',
          this.data.player.otraDenominacion,
          typeof this.data.player.otraDenominacion
        );
        console.log(
          'capitan value:',
          this.data.player.capitan,
          typeof this.data.player.capitan
        );
        console.log(
          'portero value:',
          this.data.player.portero,
          typeof this.data.player.portero
        );
        console.log(
          'noBautizado value:',
          this.data.player.noBautizado,
          typeof this.data.player.noBautizado
        );

        birthDateValue = playerDateToFormDate(this.data.player);
        console.log('Converted birth date value for form:', birthDateValue);
      } catch (error) {
        console.error('Error converting birth date:', error);
        console.log('Player data:', this.data.player);
        birthDateValue = '';
      }
    }

    this.playerForm = this.fb.group({
      nombre: [
        this.data.player?.jugador || this.data.player?.name || '',
        [Validators.required, Validators.minLength(2), playerNameValidator],
      ],
      numero: [
        this.data.player?.numero || '',
        [Validators.required, Validators.pattern(/^\d{1,3}$/)],
      ],
      celular: [
        this.data.player?.celular || '',
        [Validators.required, phoneValidator],
      ],
      fechaNacimiento: [
        birthDateValue,
        [Validators.required, ageWarningValidator],
      ],
      correo: [
        this.data.player?.correo || '',
        [Validators.required, Validators.email],
      ],
      iglesia: [this.data.player?.iglesia || '', [Validators.required]],
      capitan: [!!this.data.player?.capitan],
      portero: [!!this.data.player?.portero],
      noBautizado: [!!this.data.player?.noBautizado],
      otraDenominacion: [!!this.data.player?.otraDenominacion],
    });

    // Add async validators
    this.addAsyncValidators();
  }

  private addAsyncValidators(): void {
    // Add unique number validator
    const numeroControl = this.playerForm.get('numero');
    if (numeroControl) {
      // Get the player name - if editing, pass the name to exclude records for this player
      const playerName = this.isEditMode
        ? this.data.player?.jugador || this.data.player?.name
        : undefined;

      console.log('🎯 Setting up validator:', {
        isEditMode: this.isEditMode,
        playerName,
        teamName: this.data.teamName,
      });

      const asyncValidators = [
        uniquePlayerNumberValidator(
          this.playerPendingService,
          this.data.teamName,
          playerName
        ),
      ];

      numeroControl.setAsyncValidators(asyncValidators);
      numeroControl.updateValueAndValidity();
    }
  }

  async onSubmit(): Promise<void> {
    // Check for real errors (not warnings)
    if (this.hasRealErrors()) {
      this.markFormGroupTouched();
      this.showErrorMessage('Por favor corrige los errores en el formulario');
      return;
    }

    this.isLoading = true;

    try {
      const formValue = this.playerForm.value;

      // Debug: Log form values
      console.log('Form values:', formValue);
      console.log('fechaNacimiento value:', formValue.fechaNacimiento);

      // Build player object with proper date conversion
      const { dateBirth, fechaNacimiento } = formDateToPlayerDate(
        formValue.fechaNacimiento
      );

      // Debug: Log converted dates
      console.log('Converted dateBirth:', dateBirth);
      console.log('Converted fechaNacimiento timestamp:', fechaNacimiento);

      const player: IPlayer = {
        ...formValue,
        // Ensure all name fields are consistent and normalized
        jugador: formValue.nombre.trim().toUpperCase(),
        name: formValue.nombre.trim().toUpperCase(),
        equipo: this.data.teamName,
        estado: 'Activo',
        fechaRegistro: new Date().toISOString(),
        dateBirth,
        fechaNacimiento,
        noAlinea: false,
        // Map denomination field - now boolean
        otraDenominacion: formValue.otraDenominacion,
        // Initialize stats to 0
        amarillas: 0,
        rojas: 0,
        goles: 0,
        autogoles: 0,
        asistencias: 0,
        faltas: 0,
      };

      // Use captain strategy for submission
      if (this.isEditMode && this.data.pendingPlayerId) {
        // Mode: Edit pending player
        await this.captainStrategy.updatePendingPlayer(
          this.data.pendingPlayerId,
          player
        );
      } else if (this.isEditMode && this.data.player?.id) {
        // Mode: Edit existing approved player
        await this.captainStrategy.updatePlayer(this.data.player.id, player);
      } else {
        // Mode: Create new player
        await this.captainStrategy.createPlayer(player);
      }

      this.bottomSheetRef.dismiss({
        action: 'save',
        player,
      } as PlayerFormResult);
    } catch (error: any) {
      console.error('Error al enviar solicitud:', error);
      this.showErrorMessage(error.message || 'Error al enviar la solicitud');
    } finally {
      this.isLoading = false;
    }
  }

  onCancel(): void {
    this.bottomSheetRef.dismiss({
      action: 'cancel',
    } as PlayerFormResult);
  }

  /**
   * Handles player deletion with confirmation dialog
   */
  async onDelete(): Promise<void> {
    if (!this.isEditMode || !this.data.player) {
      return;
    }

    const player = this.data.player;

    // Check if player is a captain and add special warning
    const isCaptain = player.capitan === true || player.capitan === 1;
    const baseMessage = `¿Está seguro que desea dar de baja a ${player.jugador} del equipo?`;
    const captainWarning = isCaptain
      ? '\n\n⚠️ ADVERTENCIA: Este jugador es CAPITÁN del equipo.'
      : '';

    const confirmMessage =
      baseMessage +
      captainWarning +
      '\n\nEsta acción requerirá aprobación del comité organizador.';

    // Show confirmation dialog
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        message: confirmMessage,
      },
    });

    const confirmed = await dialogRef.afterClosed().toPromise();

    if (!confirmed) {
      return;
    }

    this.isLoading = true;

    try {
      // Use captain strategy to request deletion
      await this.captainStrategy.deletePlayer(player.id!);

      this.bottomSheetRef.dismiss({
        action: 'delete',
        player,
      } as PlayerFormResult);
    } catch (error: any) {
      console.error('Error al solicitar eliminación:', error);
      this.showErrorMessage(
        error.message || 'Error al solicitar la eliminación'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.playerForm.controls).forEach((key) => {
      const control = this.playerForm.get(key);
      control?.markAsTouched();
    });
  }

  private showSuccessMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar'],
    });
  }

  private showErrorMessage(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  /**
   * Checks if the form has real validation errors (not warnings)
   */
  private hasRealErrors(): boolean {
    for (const controlName of Object.keys(this.playerForm.controls)) {
      const control = this.playerForm.get(controlName);
      if (control?.errors) {
        // Check if any error is not a warning
        for (const errorKey of Object.keys(control.errors)) {
          const error = control.errors[errorKey];
          if (!error.isWarning) {
            return true;
          }
        }
      }
    }
    return false;
  }

  /**
   * Getter for template to check if form has blocking errors
   */
  get hasBlockingErrors(): boolean {
    return this.hasRealErrors();
  }

  // Helper methods for template
  hasError(controlName: string, errorType: string): boolean {
    const control = this.playerForm.get(controlName);
    return !!(control?.hasError(errorType) && control?.touched);
  }

  hasWarning(controlName: string): boolean {
    const control = this.playerForm.get(controlName);
    if (!control?.errors || !control.touched) {
      return false;
    }
    return isValidationWarning(control.errors);
  }

  getWarningMessage(controlName: string): string {
    const control = this.playerForm.get(controlName);
    if (!control?.errors || !control.touched) {
      return '';
    }

    if (isValidationWarning(control.errors)) {
      return getCustomValidatorErrorMessage(control.errors);
    }

    return '';
  }

  getErrorMessage(controlName: string): string {
    const control = this.playerForm.get(controlName);

    if (!control?.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;

    // Check custom validators first
    const customMessage = getCustomValidatorErrorMessage(errors);
    if (customMessage !== 'Error de validación') {
      return customMessage;
    }

    // Handle standard validators
    if (errors['required']) {
      switch (controlName) {
        case 'correo':
          return 'El correo electrónico es obligatorio';
        case 'iglesia':
          return 'La iglesia es obligatoria';
        default:
          return 'Este campo es obligatorio';
      }
    }

    if (errors['email']) {
      return 'Formato de correo electrónico inválido';
    }

    if (errors['minlength']) {
      return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    }

    if (errors['pattern']) {
      switch (controlName) {
        case 'numero':
          return 'El número debe ser entre 1 y 999';
        default:
          return 'Formato inválido';
      }
    }

    return 'Error de validación';
  }

  // Method to convert name input to uppercase
  onNameInput(event: any): void {
    const input = event.target;
    const value = input.value.toUpperCase();

    // Update the form control value
    this.playerForm.get('nombre')?.setValue(value, { emitEvent: false });

    // Update the input value directly
    input.value = value;
  }

  /**
   * Gets the appropriate text for the primary action button
   */
  get primaryButtonText(): string {
    if (this.isLoading) {
      return 'GUARDANDO...';
    }

    if (this.isEditMode) {
      // Check if editing a pending player
      if (this.data.pendingPlayerId) {
        return 'GUARDAR CAMBIOS';
      }
      // Editing an active player
      return 'ACTUALIZAR DATOS';
    }

    // Creating new player
    return 'SOLICITAR ALTA';
  }

  /**
   * Gets the appropriate text for the delete button
   */
  get deleteButtonText(): string {
    return 'SOLICITAR BAJA';
  }

  /**
   * Gets the appropriate icon for the primary action button
   */
  get primaryButtonIcon(): string {
    if (this.isEditMode) {
      return this.data.pendingPlayerId ? 'save' : 'update';
    }
    return 'person_add';
  }
}
