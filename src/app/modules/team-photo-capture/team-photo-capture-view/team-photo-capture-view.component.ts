import {
  Component,
  HostListener,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { ITeam } from '@app-core/models/team';
import { ModalService } from '@app-core/services/modal.service';
import { TeamService } from '@app-core/services/team.service';
import {
  FormDialogComponent,
  FormDialogResult,
} from '@app-shared/form-dialog/form-dialog.component';
import { WebcamImage } from 'ngx-webcam';
import { firstValueFrom, Subject } from 'rxjs';

@Component({
  selector: 'app-team-photo-capture-view',
  templateUrl: './team-photo-capture-view.component.html',
  styleUrls: ['./team-photo-capture-view.component.scss'],
})
export class TeamPhotoCaptureViewComponent {
  modalService = inject(ModalService);
  teamService = inject(TeamService);
  trigger: Subject<void> = new Subject<void>();
  public webcamImage?: WebcamImage;
  screenWidth: number;
  isGeoLocationAvailable = false;
  isLandscape = false;
  isLoading = true;

  markerPosition: google.maps.LatLngLiteral | null = null;
  teams: ITeam[] = [];
  selectedTeam: string = '';
  now = new Date();

  constructor(private cdr: ChangeDetectorRef) {
    this.screenWidth = window.innerWidth;
  }

  private updateScreenWidth() {
    this.screenWidth = window.innerWidth;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  private getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.markerPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        this.isGeoLocationAvailable = true;
        this.cdr.detectChanges(); // Manually trigger change detection
      });
    }
  }

  askForTeamName(): void {
    this.modalService
      .openFormDialog(FormDialogComponent, {
        title: 'Elige tu equipo',
        description: 'Seleccione el equipo al que pertencen los jugadores',
        label: 'Equipo',
        items: this.teams.map((item) => item.nombre),
        multiple: false,
        required: true,
        canCancel: false,
      })
      .subscribe(async (result: FormDialogResult) => {
        if (result.success) {
          this.selectedTeam = result.selection as string;
        }
      });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateScreenWidth();
    this.updateOrientation();
  }

  private updateOrientation() {
    this.isLandscape = window.innerWidth > window.innerHeight;
    this.cdr.detectChanges(); // Manually trigger change detection
  }

  ngOnInit() {
    this.updateOrientation();
    this.loadTeams().then(() => {
      this.isLoading = false;
      this.askForTeamName();
    });
  }

  async loadTeams() {
    this.teams = await firstValueFrom(this.teamService.getTeams());
  }

  capture(): void {
    this.trigger.next();
    this.now = new Date();
    this.getUserLocation();
  }

  captureAgain(): void {
    this.webcamImage = undefined;
  }

  submit(): void {
    if (this.webcamImage) {
      // Handle the submission of the captured image
      console.log('Image submitted:', this.webcamImage.imageAsDataUrl);
    } else {
      console.error('No image to submit');
    }
  }
}
