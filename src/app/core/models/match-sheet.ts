export interface MatchSheet {
  id: string;
  matchId: string;
  homeScore: number;
  awayScore: number;
  players: MatchSheetPlayer[];
  comments: string;
  status: 'pending' | 'published';
}

export interface MatchSheetPlayer {
  playerId: string;
  team: string;
  attended: boolean;
  ownGoals: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}
