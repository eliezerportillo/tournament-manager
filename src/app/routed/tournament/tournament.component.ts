import { Component, AfterViewInit , ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements AfterViewInit  {
  section: string;
  constructor(private route: ActivatedRoute) {
    this.section = '';
  }

  @ViewChild('tabGroup') tabGroup?: MatTabGroup;

  ngAfterViewInit(): void {
    // Access the URL parameters here

    this.route.queryParams.subscribe(params => {
      // Get the value of a specific parameter by its name
      this.section = params['section'] ?? '';

      this.activateTab(this.section);
    });
  }


  // Function to activate a specific tab based on the label name
  activateTab(labelName: string) {
    if (this.tabGroup) {
      const tabToActivate = this.tabGroup._tabs.find(tab => tab.textLabel === labelName);
      if (tabToActivate) {
        this.tabGroup.selectedIndex = tabToActivate.position;
      }
    }
  }
}
