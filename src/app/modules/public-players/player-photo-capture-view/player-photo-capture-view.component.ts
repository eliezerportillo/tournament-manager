import { Component, OnInit, inject } from '@angular/core';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { Subject, Observable, finalize, firstValueFrom } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { TeamService } from '@app-core/services/team.service';
import { ITeam } from '@app-core/models/team';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IPlayer } from '@app-core/models/player';
import { PlayerService } from '@app-core/services/player.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-player-photo-capture-view',
  templateUrl: './player-photo-capture-view.component.html',
  styleUrls: ['./player-photo-capture-view.component.scss'],
})
export class PlayerPhotoCaptureViewComponent implements OnInit {
  storage: AngularFireStorage = inject(AngularFireStorage);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  teamService = inject(TeamService);
  playerService = inject(PlayerService);
  firestore = inject(AngularFirestore);

  screenWidth?: number;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId?: string;
  public videoOptions: MediaTrackConstraints = {
    // Set any desired constraints for the video stream
    facingMode: '',
  };

  public errors: WebcamInitError[] = [];
  public webcamImage?: WebcamImage;

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  croppedImage?: string | null;
  imageChangedEvent: any = '';

  photoReady = false;
  teams: ITeam[] = [];
  form: FormGroup;
  playersList: PlayerList;

  constructor(fb: FormBuilder) {
    this.playersList = {};

    const teamNameControl = fb.control<string>('', Validators.required);
    this.form = fb.group({
      teamName: teamNameControl,
      playerName: fb.control<string>(''),
    });

    teamNameControl.valueChanges.subscribe((value) =>
      this.refreshPlayersList(value),
    );
  }

  get teamName() {
    return this.form.value?.teamName;
  }

  get players() {
    return this.playersList[this.teamName];
  }

  refreshPlayersList(teamName: string | null): void {
    if (!teamName) return;
    this.form.get('playerName')?.reset();
    this.getPlayers(teamName);
  }

  async getPlayers(teamName: string) {
    this.playersList[teamName] = this.playerService.getPlayersByTeam(teamName);
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.getTeams();
  }

  async getTeams() {
    this.teams = await firstValueFrom(this.teamService.getTeams());
  }

  public handleImageCapture(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  imageCroppedEvent?: ImageCroppedEvent;

  imageCropped(event: ImageCroppedEvent) {
    // this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(event.objectUrl ?? '');
    this.croppedImage = event.base64;

    this.imageCroppedEvent = event;
  }

  finishCrop() {
    this.photoReady = true;

    if (!this.croppedImage) return;

    this.uploadImageToFirebase(this.croppedImage);
  }

  private async resolveSelectedPlayer(): Promise<IPlayer | null> {
    const teamName = this.form.value?.teamName?.toString().trim();
    const playerName = this.form.value?.playerName?.toString().trim();

    if (!teamName || !playerName) {
      return null;
    }

    const players = await firstValueFrom(
      this.playerService.getPlayersByTeam(teamName),
    );

    return (
      players.find((player) => {
        const candidateNames = [player.jugador, player.name].filter(
          (value): value is string => !!value && value.trim().length > 0,
        );

        return candidateNames.some(
          (candidate) =>
            candidate.trim().toUpperCase() === playerName.toUpperCase(),
        );
      }) ?? null
    );
  }

  private getValidBadgeIdentity(selectedPlayer: IPlayer | null): {
    teamName: string;
    playerName: string;
  } | null {
    const teamName = this.form.value?.teamName?.toString().trim();
    const playerName =
      selectedPlayer?.jugador?.trim() ||
      selectedPlayer?.name?.trim() ||
      this.form.value?.playerName?.toString().trim();

    if (!teamName || !playerName) {
      return null;
    }

    return { teamName, playerName };
  }

  uploaded = false;
  async uploadImageToFirebase(blob: string) {
    this.uploaded = false;

    const selectedPlayer = await this.resolveSelectedPlayer();
    const badgeIdentity = this.getValidBadgeIdentity(selectedPlayer);

    if (!badgeIdentity) {
      this.uploadedImageUrl = '';
      this.uploaded = false;
      return;
    }

    const refStorage = this.storage.ref(
      `images/players/${badgeIdentity.teamName}-${badgeIdentity.playerName}`,
    );
    const task = await refStorage.putString(blob, 'data_url', {
      contentType: 'image/png',
    });
    const url = await task.ref.getDownloadURL();

    await this.updateFirestoreDocument(url, badgeIdentity);
  }

  uploadedImageUrl: string = '';

  async updateFirestoreDocument(
    photoUrl: string,
    badgeIdentity: { teamName: string; playerName: string },
  ) {
    const collection = this.firestore.collection('badges');
    const snapshot = await collection.ref
      .where('teamName', '==', badgeIdentity.teamName)
      .where('playerName', '==', badgeIdentity.playerName)
      .limit(1)
      .get();

    const data = snapshot.docs[0];
    const docRef = data ? collection.doc(data.id) : collection.doc();

    await docRef.set(
      {
        teamName: badgeIdentity.teamName,
        playerName: badgeIdentity.playerName,
        photoUrl: photoUrl,
      },
      { merge: true },
    );

    this.uploadedImageUrl = photoUrl;
    this.uploaded = true;
  }
}

interface PlayersFilter {
  teamName: string;
}

interface PlayerList {
  [teamName: string]: Observable<IPlayer[]>;
}
