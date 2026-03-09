import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Observable, of, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PlayerPendingService } from '@app-core/services/player-pending.service';

/**
 * Async validator to check if player number is unique within a team
 */
export function uniquePlayerNumberValidator(
  playerPendingService: PlayerPendingService,
  teamName: string,
  playerName?: string
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    const numero = control.value.toString();

    return from(
      playerPendingService.isPlayerNumberUnique(teamName, numero, playerName)
    ).pipe(
      map((isUnique) => {
        return isUnique
          ? null
          : { numberTaken: { value: numero, team: teamName } };
      }),
      catchError(() => {
        // In case of error, allow the value (don't block user)
        return of(null);
      })
    );
  };
}

/**
 * Basic phone number format validator
 */
export function phoneValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const phoneNumber = control.value.toString().trim();

  // Basic phone format: at least 10 digits
  const phonePattern = /^\d{10,}$/;

  if (!phonePattern.test(phoneNumber)) {
    return {
      invalidPhone: {
        value: phoneNumber,
        message: 'Debe ser un número de teléfono válido (al menos 10 dígitos)',
      },
    };
  }

  return null;
}

/**
 * Validator that warns if player is underage (under 18)
 * Date required validation is handled by Validators.required
 */
export function ageWarningValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    // Let Validators.required handle empty values
    return null;
  }

  const birthDate = new Date(control.value);
  const today = new Date();

  if (isNaN(birthDate.getTime())) {
    return {
      invalidDate: {
        value: control.value,
        message: 'Fecha de nacimiento inválida',
      },
    };
  }

  // Calculate age
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  // Check for future dates
  if (birthDate > today) {
    return {
      futureDate: {
        value: control.value,
        message: 'La fecha de nacimiento no puede ser futura',
      },
    };
  }

  // Check for unreasonable ages
  if (age > 100) {
    return {
      unreasonableAge: {
        value: control.value,
        age: age,
        message: 'Verifica la fecha de nacimiento, la edad parece incorrecta',
      },
    };
  }

  // Warning for underage players (not an error, just a warning)
  if (age < 18) {
    return {
      underageWarning: {
        value: control.value,
        age: age,
        message: `(${age} años). Se requiere responsiva firmada.`,
        isWarning: true,
      },
    };
  }

  return null;
}

/**
 * Validator for player names (no numbers, special characters)
 */
export function playerNameValidator(
  control: AbstractControl
): ValidationErrors | null {
  if (!control.value) {
    return null;
  }

  const name = control.value.toString().trim();

  // Only letters, spaces, apostrophes, and hyphens allowed
  const namePattern = /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/;

  if (!namePattern.test(name)) {
    return {
      invalidName: {
        value: name,
        message: 'Solo se permiten letras, espacios, apostrofes y guiones',
      },
    };
  }

  // Check for excessive spaces
  if (name.includes('  ')) {
    return {
      excessiveSpaces: {
        value: name,
        message: 'No se permiten espacios dobles',
      },
    };
  }

  return null;
}

/**
 * Utility function to get error message for custom validators
 */
export function getCustomValidatorErrorMessage(
  errors: ValidationErrors
): string {
  if (errors['numberTaken']) {
    return `El número ${errors['numberTaken'].value} ya está en uso en ${errors['numberTaken'].team}`;
  }

  if (errors['invalidPhone']) {
    return errors['invalidPhone'].message;
  }

  if (errors['underageWarning']) {
    return errors['underageWarning'].message;
  }

  if (errors['futureDate']) {
    return errors['futureDate'].message;
  }

  if (errors['unreasonableAge']) {
    return errors['unreasonableAge'].message;
  }

  if (errors['invalidColombianId']) {
    return errors['invalidColombianId'].message;
  }

  if (errors['invalidName']) {
    return errors['invalidName'].message;
  }

  if (errors['excessiveSpaces']) {
    return errors['excessiveSpaces'].message;
  }

  if (errors['invalidDate']) {
    return 'Fecha inválida';
  }

  return 'Error de validación';
}

/**
 * Helper function to check if error is a warning (not blocking)
 */
export function isValidationWarning(errors: ValidationErrors): boolean {
  for (const errorKey of Object.keys(errors)) {
    const error = errors[errorKey];
    if (error?.isWarning) {
      return true;
    }
  }
  return false;
}
