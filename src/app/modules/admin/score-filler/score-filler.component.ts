import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, FormBuilder, ValidatorFn } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IMatch } from '@app-core/models/match';
import { MatchService } from '@app-core/services/match.service';
import { UpdateScoreCommand } from '@app-core/services/update-score.command';
import { HourPipe } from '@app-shared/pipes/hour.pipe';

@Component({
  selector: 'app-score-filler',
  templateUrl: './score-filler.component.html',
  styleUrls: ['./score-filler.component.scss']
})
export class ScoreFillerComponent {
  title: string;
  score: string;
  form: FormGroup;
  fb: FormBuilder = inject(FormBuilder);
  matchService: MatchService = inject(MatchService);
  command: UpdateScoreCommand = inject(UpdateScoreCommand);
  hourPipe: HourPipe = inject(HourPipe);
  bottomSheetRef: MatBottomSheetRef<ScoreFillerComponent> = inject(MatBottomSheetRef<ScoreFillerComponent>);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { match: IMatch }) {
    this.title = `Información del partido`;
    this.form = this.initForm(data.match);
    this.score = this.getScore(data.match);
  }

  private getScore(match: IMatch): string {
    return `${match.marcadorLocal}-${match.marcadorVisita}`;
  }

  close() {    
    this.bottomSheetRef.dismiss(this.data.match);
  }

  initForm(match: IMatch): FormGroup {
    const time = this.hourPipe.transform(match.dateTime) ?? '';
    return this.fb.group({
      local: new FormControl<number | null>(match.marcadorLocal, [Validators.min(0)]),
      visita: new FormControl<number | null>(match.marcadorVisita, [Validators.min(0)]),
      date: new FormControl<Date>(match.dateTime, [Validators.required]),
      time: new FormControl<string>(time),
      field: new FormControl<string>(match.campo),
    },
      {
        validators: [MatchValidators.scoreValidator()]
      });
  }

  get local() {
    return this.form.get('local');
  }

  get visita() {
    return this.form.get('visita');
  }

  get date() {
    return this.form.get('date');
  }

  get time() {
    return this.form.get('time');
  }

  get field() {
    return this.form.get('field');
  }

  increment(team: 'local' | 'visita') {
    const control = this.form.get(team);
    const value = Number(control?.value);
    control?.setValue(value + 1);
  }

  decrement(team: 'local' | 'visita') {
    const control = this.form.get(team);
    const value = Number(control?.value);
    control?.setValue(value - 1);
  }

  async save() {
    this.data.match.marcadorLocal = this.local?.value;
    this.data.match.marcadorVisita = this.visita?.value;
    this.data.match.campo = this.field?.value;
    this.data.match.fecha = this.convertToExcelDate(this.date?.value);
    this.data.match.hora = this.convertToExcelTime(this.convertTimeStringToMilliseconds(this.time?.value));
    
    this.data.match.dateTime = this.setTime(this.time?.value, this.date?.value);
    await this.command.execute(this.data.match);
    this.close();
  }

  private setTime(hourString: string, date: Date) {
    const [hour, minute] = hourString.split(':').map(Number);

    // Set the hour and minute to the Date object
    date?.setHours(hour);
    date?.setMinutes(minute || 0);
    return date;
  }

  async delete() {
    this.local?.patchValue(null)
    this.visita?.patchValue(null)
    await this.save();
    this.form = this.initForm(this.data.match);
  }

  private convertTimeStringToMilliseconds(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);

    const totalMilliseconds = hours * 60 * 60 * 1000 + minutes * 60 * 1000;

    return totalMilliseconds;
  }

  private convertToExcelTime(timeInMilliseconds: number): number {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const fractionOfDay = (hours + minutes / 60 + remainingSeconds / 3600) / 24;
    const excelTimeNumber = fractionOfDay;

    return excelTimeNumber;
  }

  private convertToExcelDate(date: Date): number {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const epochStart = Date.UTC(1899, 11, 30); // Excel's epoch starts on December 31, 1899

    const daysSinceEpoch = Math.floor((date.getTime() - epochStart) / millisecondsPerDay);
    const excelDateNumber = daysSinceEpoch;

    return excelDateNumber;
  }
}


class MatchValidators {
  static scoreValidator(): ValidatorFn {
    return (group: AbstractControl<MatchForm>): ValidationErrors | null => {
      const local = group.value.local;
      const visita = group.value.visita;

      const localControl = group.get('local');
      localControl?.setErrors(null);
      const vistaControl = group.get('visita');
      vistaControl?.setErrors(null);
      if (local === null && visita !== null) {
        const err = { localScoreMissing: true };
        localControl?.setErrors(err);
        return err;
      } else if (visita === null && local !== null) {
        const err = { visitaScoreMissing: true };
        vistaControl?.setErrors(err);
        return err;
      }
      return null;
    };

  }
}

interface MatchForm {
  local: number | null;
  visita: number | null;
  date: Date;
  time: string;
  field: string;
}