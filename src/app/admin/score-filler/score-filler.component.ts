import { Component, Inject, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { IMatch } from 'src/app/models/match';
import { MatchService } from 'src/app/services/match.service';
import { UpdateScoreCommand } from 'src/app/services/update-score.command';

@Component({
  selector: 'app-score-filler',
  templateUrl: './score-filler.component.html',
  styleUrls: ['./score-filler.component.scss']
})
export class ScoreFillerComponent {
  title: string;
  form: FormGroup;
  matchService: MatchService = inject(MatchService);
  command: UpdateScoreCommand = inject(UpdateScoreCommand);
  bottomSheetRef: MatBottomSheetRef<ScoreFillerComponent> = inject(MatBottomSheetRef<ScoreFillerComponent>);
  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { match: IMatch }) {
    this.title = `Información de partido`;
    this.form = this.initForm(data.match);
  }

  initForm(match: IMatch): FormGroup {
    return new FormGroup({
      local: new FormControl<number | null>(match.marcadorLocal, [Validators.min(0)]),
      visita: new FormControl<number | null>(match.marcadorVisita, [Validators.min(0)]),
      date: new FormControl<Date>(match.date, [Validators.required]),
      time: new FormControl<string>(match.hour, [Validators.required]),
      field: new FormControl<string>(match.campo, [Validators.required]),
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
    await this.command.execute(this.data.match);
    console.log(this.data.match);
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
    const epochStart = Date.UTC(1899, 11, 31); // Excel's epoch starts on December 31, 1899

    const daysSinceEpoch = Math.floor((date.getTime() - epochStart) / millisecondsPerDay);
    const excelDateNumber = daysSinceEpoch;

    return excelDateNumber;
  }
}
