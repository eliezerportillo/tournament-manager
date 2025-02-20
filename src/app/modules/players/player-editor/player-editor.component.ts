import { Component, Inject, inject, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IModalComponent } from '@app-core/models/editor-component';
import { IPlayer } from '@app-core/models/player';
import { BatchItemCreatorCommand } from '@app-core/services/batch-item-creator.command';
import { CreatePlayerCommand } from '@app-core/services/create-player.command';
import { DeletePlayerCommand } from '@app-core/services/delete-player.command';
import { UpdatePlayerCommand } from '@app-core/services/update-player.command';
import { BatchCreatorComponent } from '@app-shared/components/batch-creator/batch-creator.component';

@Component({
  selector: 'app-player-editor',
  templateUrl: './player-editor.component.html',
  styleUrls: ['./player-editor.component.scss'],
})
export class PlayerEditorComponent implements IModalComponent {
  bottomSheetRef = inject(MatBottomSheetRef<PlayerEditorComponent>);
  updatePlayerCommand = inject(UpdatePlayerCommand);
  deletePlayerCommand = inject(DeletePlayerCommand);
  createPlayerCommand = inject(CreatePlayerCommand);
  batchItemCreatorCommand = inject(BatchItemCreatorCommand);

  @ViewChild(BatchCreatorComponent)
  batchCreatorComponent!: BatchCreatorComponent;

  fb = inject(FormBuilder);
  form: FormGroup;
  activePlayerForm = TypePlayerForm.OnePlayer;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { player: IPlayer; isNew: boolean; team: string }
  ) {
    this.form = this.initForm(data);
  }

  get isNew() {
    return this.data.isNew;
  }

  get yCards() {
    return this.form.get('yellowCards') as FormControl;
  }

  get rCards() {
    return this.form.get('redCards') as FormControl;
  }

  get goals() {
    return this.form.get('goals') as FormControl;
  }

  get assists() {
    return this.form.get('assists') as FormControl;
  }

  get ownGoals() {
    return this.form.get('ownGoals') as FormControl;
  }

  get playerNumber() {
    return this.form.get('number') as FormControl;
  }

  get isCap() {
    return this.form.get('isCap');
  }

  get hasNumber() {
    return this.form.get('number')?.value ? true : false;
  }

  get playersControl() {
    return this.form.get('name') as FormControl;
  }

  onFormTypeChanges(event: MatTabChangeEvent) {
    this.form = this.initForm(this.data);
  }

  initForm(data: { player: IPlayer; isNew: boolean; team: string }): FormGroup {
    let form = this.fb.group(
      {
        number: [
          data.isNew ? '' : data.player.numero ?? '',
          Validators.required,
        ],
        name: [
          data.isNew ? '' : (data.player.name || data.player.jugador) ?? '',
          Validators.required,
        ],
        team: [data.team, Validators.required],
        yellowCards: [
          data.isNew ? 0 : data.player.amarillas ?? 0,
          Validators.min(0),
        ],
        redCards: [data.isNew ? 0 : data.player.rojas ?? 0, Validators.min(0)],
        goals: [data.isNew ? 0 : data.player.goles ?? 0, Validators.min(0)],
        ownGoals: [
          data.isNew ? 0 : data.player.autogoles ?? 0,
          Validators.min(0),
        ],
        assists: [
          data.isNew ? 0 : data.player.asistencias ?? 0,
          Validators.min(0),
        ],
        isCap: [data.isNew ? false : data.player.capitan ?? false],
        isGoalkeeper: [data.isNew ? false : data.player.portero ?? false],
        isListener: [data.isNew ? false : data.player.noBautizado ?? false],
        email: [data.isNew ? '' : data.player.correo ?? '', Validators.email],
        cannotPlay: [data.isNew ? false : data.player.noAlinea ?? false],
      },
      {
        validators: [PlayerValidators.captainValidator()],
      }
    );

    return form;
  }

  close(): void {
    this.bottomSheetRef.dismiss();
  }

  async delete() {
    await this.deletePlayerCommand.execute(this.data.player);
    this.close();
  }

  save() {
    if (this.activePlayerForm == TypePlayerForm.OnePlayer) {
      this.savePlayer();
    } else if (this.activePlayerForm == TypePlayerForm.MorePlayers) {
      this.createPlayers();
    }

    this.close();
  }

  async createPlayers() {
    const players: IPlayer[] =
      this.batchCreatorComponent.createObjects<IPlayer>();
    this.batchItemCreatorCommand.execute(
      players.map((p) => {
        (p.equipo = this.data.team), (p.jugador = p.name);
        return p;
      })
    );
  }

  private savePlayer() {
    if (this.isNew) {
      this.createPlayer();
    } else {
      this.updatePlayer();
    }
  }

  private async updatePlayer() {
    this.data.player.goles = this.form.value?.goals;
    this.data.player.asistencias = this.form.value?.assists;
    this.data.player.autogoles = this.form.value?.ownGoals;
    this.data.player.amarillas = this.form.value?.yellowCards;
    this.data.player.rojas = this.form.value?.redCards;
    this.data.player.numero = this.form.value?.number;
    this.data.player.noAlinea = this.form.value?.cannotPlay ? 1 : 0;
    this.data.player.capitan = this.form.value?.isCap ? 1 : 0;
    this.data.player.portero = this.form.value?.isGoalkeeper ? 1 : 0;
    this.data.player.noBautizado = this.form.value?.isListener ? 1 : 0;
    this.data.player.correo = this.form.value?.email;

    await this.updatePlayerCommand.execute(this.data.player);
  }

  private async createPlayer() {
    const player: IPlayer = {
      numero: this.form.value?.number,
      name: this.form.value?.name,
      jugador: this.form.value?.name,
      equipo: this.data.team,
      capitan: this.form.value?.isCap,
      portero: this.form.value?.isGoalkeeper,
      noBautizado: this.form.value?.isListener,
      dateBirth: null,
      noAlinea: this.form.value?.cannotPlay,
    };

    if (player.capitan) {
      player.correo = this.form.value?.email;
    }

    await this.createPlayerCommand.execute(player);
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

enum TypePlayerForm {
  OnePlayer = 0,
  MorePlayers = 1,
}
