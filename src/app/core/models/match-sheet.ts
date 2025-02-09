


export interface MatchSheet {    
    id: string,
    matchId: string,    
    homeScore: number,
    awayScore: number,
    players: {
        playerId: string,
        team: string,
        attended: boolean,
        goals: number,
        assists: number,
        yellowCards: number,
        redCards: number
    }[],
    comments: string
    status: 'pending' | 'published'
}