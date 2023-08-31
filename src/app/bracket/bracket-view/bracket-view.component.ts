import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bracket-view',
  templateUrl: './bracket-view.component.html',
  styleUrls: ['./bracket-view.component.scss']
})
export class BracketViewComponent implements OnInit {
  @ViewChild('bracketContainer', { static: true }) bracketContainer?: ElementRef;

  constructor() { }

  ngOnInit(): void {
    this.createBracket();
  }

  createBracket(): void {
    const svg = d3.select(this.bracketContainer?.nativeElement)
      .append('svg')
      .attr('width', 800)
      .attr('height', 400);

    // Example data: Single-elimination tournament with four rounds
    const rounds = [
      ['A', 'B', 'C', 'D'],
      ['E', 'F'],
      ['G']
    ];

    const matchHeight = 40;
    const xOffset = 100;
    const yOffset = 50;

    rounds.forEach((round, roundIndex) => {
      const roundWidth = (round.length - 1) * matchHeight;

      round.forEach((match, matchIndex) => {
        const x = roundIndex * xOffset;
        const y = matchIndex * yOffset + (roundWidth - (matchHeight * (round.length - 1))) / 2;

        svg.append('rect')
          .attr('x', x)
          .attr('y', y)
          .attr('width', matchHeight)
          .attr('height', matchHeight)
          .style('fill', 'none')
          .style('stroke', 'black');

        svg.append('text')
          .attr('x', x + matchHeight / 2)
          .attr('y', y + matchHeight / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'middle')
          .text(match);
      });
    });
  }
}
