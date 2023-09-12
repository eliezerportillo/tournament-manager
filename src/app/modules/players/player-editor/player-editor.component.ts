import { Component, Inject, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { IEditorComponent } from '@app-core/models/editor-component';
import { Player } from '@app-core/models/player';
import { CreatePlayerCommand } from '@app-core/services/create-player.command';
import { DeletePlayerCommand } from '@app-core/services/delete-player.command';
import { UpdatePlayerCommand } from '@app-core/services/update-player.command';

@Component({
  selector: 'app-player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss']
})
export class PlayerEditorComponent implements IEditorComponent {

  bottomSheetRef = inject(MatBottomSheetRef<PlayerEditorComponent>);
  updatePlayerCommand = inject(UpdatePlayerCommand);
  deletePlayerCommand = inject(DeletePlayerCommand);
  createPlayerCommand = inject(CreatePlayerCommand);

  fb = inject(FormBuilder);
  form: FormGroup;

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: { player: Player, isNew: boolean, team: string }) {
    this.form = this.initForm(data);
  }

  get isNew() {
    return this.data.isNew;
  }

  get yCards() {
    return this.form.get('yellowCards') as FormControl
  }

  get rCards() {
    return this.form.get('redCards') as FormControl
  }

  get goals() {
    return this.form.get('goals') as FormControl
  }

  get isCap() {
    return this.form.get('isCap')
  }

  initForm(data: { player: Player, isNew: boolean, team: string }): FormGroup {
    let form = this.fb.group({
      name: [data.isNew ? '' : data.player.jugador ?? '', Validators.required],
      team: [data.team, Validators.required],
      yellowCards: [data.isNew ? 0 : data.player.amarillas ?? 0, Validators.min(0)],
      redCards: [data.isNew ? 0 : data.player.rojas ?? 0, Validators.min(0)],
      goals: [data.isNew ? 0 : data.player.goles ?? 0, Validators.min(0)],
      isCap: [data.isNew ? false : data.player.capitan ?? false],
      isGoalkeeper: [data.isNew ? false : data.player.portero ?? false],
      isListener: [data.isNew ? false : data.player.noBautizado ?? false],
      email: [data.isNew ? '' : data.player.correo ?? '', Validators.email],
    },
      {
        validators: [PlayerValidators.captainValidator()]
      });


    return form;
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  async delete() {
    await this.deletePlayerCommand.execute(this.data.player);
    this.close();
  }

  async save() {


    if (this.isNew) {
      const player: Player = {
        jugador: this.form.value?.name,
        equipo: this.data.team,
        amarillas: this.form.value?.yellowCards,
        rojas: this.form.value?.redCards,
        goles: this.form.value?.goals,
        capitan: this.form.value?.isCap,
        portero: this.form.value?.isGoalkeeper,
        noBautizado: this.form.value?.isListener,
        correo: this.form.value?.email,
      }
      await this.createPlayerCommand.execute(player);
    } else {
      this.data.player.amarillas = this.form.value?.yellowCards;
      this.data.player.rojas = this.form.value?.redCards;
      this.data.player.goles = this.form.value?.goals;
      this.data.player.capitan = this.form.value?.isCap;
      this.data.player.portero = this.form.value?.isGoalkeeper;
      this.data.player.noBautizado = this.form.value?.isListener;
      this.data.player.correo = this.form.value?.email;
      await this.updatePlayerCommand.execute(this.data.player);
    }

    this.close();
  }


}

class PlayerValidators {
  static captainValidator(): ValidatorFn {
    return (group: AbstractControl<PlayerForm>): ValidationErrors | null => {
      const isChecked = group.get('isCap')?.value ?? false;
      const otherValue = group.get('email')?.value ?? '';
      if (isChecked && !otherValue) {
        return { email: true };
      }
      return null;
    };

  }
}

interface PlayerForm {
  yellowCards: number;
  redCards: number;
  isCap: boolean;
  isListener: boolean;
  email: string;
}
