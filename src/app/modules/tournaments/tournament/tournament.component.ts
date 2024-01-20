import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { IMenu } from '@app-core/models/menu';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements AfterViewInit {
  section: string;
  menus: IMenu[];
  constructor(private route: ActivatedRoute) {
    this.section = '';
    this.menus = [
      { text: 'PARTIDOS', path: '/matches' },
      { text: 'POSICIONES', path: '/ranking' },
      { text: 'FASE FINAL', path: '/bracket' },
      { text: 'ESTADÍSTICAS', path: '/stats' },      
    ];
  }

  @ViewChild('tabGroup') tabGroup?: MatTabGroup;

  ngAfterViewInit(): void {
    // Access the URL parameters here

    // this.route.queryParams.subscribe(params => {
    //   // Get the value of a specific parameter by its name
    //   this.section = params['section'] ?? '';

    //   this.activateTab(this.section);
    // });
  }


  // Function to activate a specific tab based on the label name
  activateTab(labelName: string) {
    if (this.tabGroup) {
      const tabToActivate = this.tabGroup._tabs.find(tab => tab.textLabel === labelName);
      if (tabToActivate && this.tabGroup) {
        this.tabGroup.selectedIndex = tabToActivate.position as number;
      }
    }
  }
}
