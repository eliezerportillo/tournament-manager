import { BaseObject } from './entity';

export interface IMatchSheet {
  id: string;
  matchId: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  players: IMatchSheetPlayer[];
  comments: string;
  status: 'pending' | 'published';
}

export interface IMatchSheetPlayer {
  playerId: string;
  playerName: string;
  team: string;
  attended: boolean;
  ownGoals: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export class MatchSheet extends BaseObject implements IMatchSheet {
  id: string;
  matchId: string;
  homeTeam: string;
  homeScore: number;
  awayTeam: string;
  awayScore: number;
  players: IMatchSheetPlayer[];
  comments: string;
  status: 'pending' | 'published';

  constructor(matchId: string, players: IMatchSheetPlayer[] = []) {
    super();
    this.id = matchId;
    this.matchId = matchId;
    this.homeTeam = '';
    this.homeScore = 0;
    this.awayTeam = '';
    this.awayScore = 0;
    this.players = players;
    this.comments = '';
    this.status = 'pending';
  }
}

export class MatchSheetPlayer extends BaseObject implements IMatchSheetPlayer {
  playerId: string;
  playerName: string;
  team: string;
  attended: boolean;
  ownGoals: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;

  constructor(
    playerId: string,
    playerName: string,
    team: string,
    attended: boolean = false
  ) {
    super();
    this.playerId = playerId;
    this.playerName = playerName;
    this.team = team;
    this.attended = attended;
    this.ownGoals = 0;
    this.goals = 0;
    this.assists = 0;
    this.yellowCards = 0;
    this.redCards = 0;
  }
}
