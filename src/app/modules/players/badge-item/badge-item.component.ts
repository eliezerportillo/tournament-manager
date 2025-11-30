import { Component, ElementRef, Input, inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IBadge } from '@app-core/models/bagde';
import { IPlayer } from '@app-core/models/player';
import { AccountService } from '@app-core/services/account.service';
import { ImageService } from '@app-core/services/image.service';
import { environment } from '@app-environments/environment';
import { AgePipe } from '@app-shared/pipes/age.pipe';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-badge-item',
  templateUrl: './badge-item.component.html',
  styleUrls: ['./badge-item.component.scss'],
})
export class BadgeItemComponent implements OnInit {
  // inject agepipe

  agePipe = inject(AgePipe);

  @Input()
  badge?: IBadge;

  @Input()
  player?: IPlayer;

  accountService = inject(AccountService);
  imageService = inject(ImageService);
  playerImage$: any;
  age: number = 0;

  constructor(private elementRef: ElementRef) {}

  get componyName(): string {
    return this.accountService.companyName;
  }

  get tournamentName(): string {
    return this.accountService.tournamentName;
  }

  get edition(): string {
    return this.accountService.edition;
  }

  get season(): string {
    return this.accountService.season;
  }

  ngOnInit(): void {
    if (
      this.badge &&
      this.badge.photoUrl &&
      this.badge.photoUrl.trim() !== ''
    ) {
      this.playerImage$ = this.imageService
        .getImageBlob(this.badge.photoUrl)
        .pipe(
          catchError((error) => {
            console.warn('Failed to load player image:', error);
            return of(null); // Return null if image fails to load
          })
        );
    }

    if (this.player) {
      this.age = this.agePipe.transform(this.player.dateBirth ?? '');
    }
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  getImage(url: string) {
    if (!url || url.trim() === '') {
      return of(null);
    }
    return this.imageService.getImageBlob(url).pipe(
      catchError((error) => {
        console.warn('Failed to load image:', error);
        return of(null);
      })
    );
  }
}
