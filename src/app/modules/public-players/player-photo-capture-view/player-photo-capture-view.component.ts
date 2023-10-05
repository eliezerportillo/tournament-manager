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
  styleUrls: ['./player-photo-capture-view.component.scss']
})
export class PlayerPhotoCaptureViewComponent implements OnInit {
  storage: AngularFireStorage = inject(AngularFireStorage);
  sanitizer: DomSanitizer = inject(DomSanitizer);
  teamService = inject(TeamService);
  playerService = inject(PlayerService);
  firestore = inject(AngularFirestore)

  screenWidth?: number;

  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId?: string;
  public videoOptions: MediaTrackConstraints = {
    // Set any desired constraints for the video stream
    facingMode: ''
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
    this.form = fb.group(
      {
        teamName: teamNameControl,
        playerName: fb.control<string>('')
      }
    );

    teamNameControl.valueChanges.subscribe(value => this.refreshPlayersList(value));
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

  uploaded = false;
  async uploadImageToFirebase(blob: string) {
    this.uploaded = false;

    const refStorage = this.storage.ref(`images/players/${this.form.value.teamName}-${this.form.value.playerName}`);
    const task = await refStorage.putString(blob, 'data_url', { contentType: 'image/png' });
    const url = await task.ref.getDownloadURL();

    await this.updateFirestoreDocument(url);

  }

  uploadedImageUrl: string = '';

  async updateFirestoreDocument(photoUrl: string) {
    const collection = this.firestore.collection('badges');
    const teamName = this.form.value.teamName;
    const playerName = this.form.value.playerName;
    const snapshot = await collection.ref
      .where('teamName', '==', teamName)
      .where('playerName', '==', playerName)
      .get();

    const data = snapshot.docs[0];
    let docRef;
    if (data) {
      docRef = collection.ref.doc(data.id);
    } else {
      docRef = collection.ref.doc();
    }

    await docRef.set({
      teamName: teamName,
      playerName: playerName,
      photoUrl: photoUrl
    });

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