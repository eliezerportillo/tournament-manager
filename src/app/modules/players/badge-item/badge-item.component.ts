import { Component, ElementRef, Input, inject, OnInit } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { IBadge } from '@app-core/models/bagde';
import { IPlayer } from '@app-core/models/player';
import { AccountService } from '@app-core/services/account.service';
import { ImageService } from '@app-core/services/image.service';
import { environment } from '@app-environments/environment';
import { AgePipe } from '@app-shared/pipes/age.pipe';

@Component({
  selector: 'app-badge-item',
  templateUrl: './badge-item.component.html',
  styleUrls: ['./badge-item.component.scss']
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
  tournamentName: string;
  componyName: string;
  playerImage$: any;
  age: number = 0;


  constructor(private elementRef: ElementRef) {
    this.componyName = this.accountService.getComponyName();
    this.tournamentName = this.accountService.getTournamentName();
  }

  ngOnInit(): void {
    if (this.badge) {
      this.playerImage$ = this.imageService.getImageBlob(this.badge?.photoUrl)
    }

    if(this.player){
      this.age = this.agePipe.transform(this.player.fechaNacimiento ?? '');
    }
  }

  getNativeElement() {
    return this.elementRef.nativeElement;
  }

  getImage(url: string) {
    return this.imageService.getImageBlob(url);
  }
  
}
