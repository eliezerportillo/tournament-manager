export interface ITeam {
    nombre: string;
    PJ: number;
    G: number;
    E: number;
    P: number;
    GF: number;
    GC: number;
    DG: number;
    Pts: number;
}

export class Team {
    static createImageUrl(teamName: string){
        return `assets/${teamName}.png`; 
    }
}