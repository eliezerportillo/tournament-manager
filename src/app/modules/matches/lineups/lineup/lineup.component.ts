import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMatch, Match } from '@app-core/models/match';
import { AccountService } from '@app-core/services/account.service';
import { MatchService } from '@app-core/services/match.service';

import html2canvas from 'html2canvas';


@Component({
  selector: 'app-lineup',
  templateUrl: './lineup.component.html',
  styleUrls: ['./lineup.component.scss']
})
export class LineupComponent implements OnInit {

  local: string;
  visita: string;

  match?: IMatch;
  accountService = inject(AccountService)

  @ViewChild('lineupContainer', { static: false }) lineupContainer!: ElementRef;


  constructor(private route: ActivatedRoute, private matchService: MatchService) {

    this.local = '';
    this.visita = '';
  }  

  ngOnInit(): void {
    // Access the URL parameters here

    this.route.queryParams.subscribe(params => {
      // Get the value of a specific parameter by its name
      this.local = params['local'] ?? '';
      this.visita = params['visita'] ?? '';
      this.loadMatch();
    });


  }


  isFinished(match: IMatch): boolean {
    return Match.isFinished(match.dateTime);
  }

  async share(match: IMatch) {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`,
          text: `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`,
          url: window.location.href
        });
      } else {
        window.open(window.location.href);
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  }

  async shareAsImage(match: IMatch) {
    const element = this.lineupContainer.nativeElement; // Cambia esto al elemento específico que deseas capturar
  
    try {
      const canvas = await html2canvas(element);
      const dataUrl = canvas.toDataURL('image/png');
      const blob = this.dataURLToBlob(dataUrl);
  
      if (blob) {
        const title = this.getShareTitle(match);
        const file = this.createFile(blob, title);
        const filesArray = [file];
  
        if (this.canShareFiles(filesArray)) {
          if (navigator.share) {
            try {
              await navigator.share({
                title: title,
                text: `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`,
                files: filesArray,
                url: window.location.href
              });
              console.log('Share was successful.');
            } catch (error) {
              console.error('Error sharing content:', error);
              alert('Error sharing content. Please try again.');
            }
          } else {
            alert('Web Share API is not supported in your browser.');
          }
        } else {
          console.warn('Sharing files is not supported in your browser.');
          alert('Sharing files is not supported in your browser.');
        }
      }
    } catch (error) {
      console.error('Screenshot capture failed', error);
      alert('Screenshot capture failed. Please try again.');
    }
  }
  
  private dataURLToBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  private async canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b));
    });
  }

  private getShareTitle(match: IMatch): string {
    return `${match.local} vs ${match.visita}. Campo ${match.campo}. ${match.dateTime}`;
  }

  private createFile(blob: Blob, title: string): File {
    return new File([blob], title + '.png', { type: 'image/png' });
  }

  private canShareFiles(filesArray: File[]): boolean {
    return navigator.canShare && navigator.canShare({ files: filesArray });
  }

  private async shareContent(title: string, url: string, files?: File[]) {
    
  }

  private async loadMatch() {
    this.match = await this.matchService.getMatch(this.local, this.visita);
  }
}
