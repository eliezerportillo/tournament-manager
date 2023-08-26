import { IEntity } from "./entity";

export interface IMatch extends IEntity {
    [key: string]: Object | null;
    jornada: string;
    local: string;
    marcadorLocal: number | null;
    imageUrlLocal: string;
    marcadorVisita: number | null;
    imageUrlVisita: string;
    visita: string;
    fecha: number;
    date: Date;
    dateTime: Date;
    hour: string;
    hora: number;
    campo: string;
}

export class Match {
    static isFinished(matchDateTime: Date): boolean {
        const today = new Date();
        today.setHours(today.getHours() + 1);
        return matchDateTime < today;
    }

}


export class MatchResult {
    today: Date;
    constructor(private match: IMatch) {
        this.today = new Date();

    }
    get date(): Date {
        return this.match.date
    }
    get finished(): boolean {
        this.today.setHours(this.today.getHours() + 1);
        return this.today > this.match?.dateTime;
    }

    get played(): boolean {
        return this.match.marcadorLocal != undefined || this.match.marcadorLocal != null;
    }

    get draw(): boolean {
        return this.marcadorLocal == this.marcadorVisita;
    }

    get hasWinner(): boolean {
        return this.played && !this.draw;
    }

    get marcadorLocal(): number {
        return Number(this.match.marcadorLocal);
    }

    get marcadorVisita(): number {
        return Number(this.match.marcadorVisita)
    }

    get local(): string { return this.match.local }
    get visita(): string { return this.match.visita }

    get winner(): string {
        if (!this.hasWinner) {
            return '';
        }

        return this.marcadorLocal > this.marcadorVisita ? this.local : this.visita;
    }

    get loser(): string {
        if (!this.hasWinner) {
            return '';
        }

        return this.marcadorLocal < this.marcadorVisita ? this.local : this.visita;
    }

    get winnerResult(): number {
        if (!this.hasWinner) {
            return 0;
        }

        return this.marcadorLocal > this.marcadorVisita ? this.marcadorLocal : this.marcadorVisita;
    }

    get loserResult(): number {
        if (!this.hasWinner) {
            return 0;
        }

        return this.marcadorLocal < this.marcadorVisita ? this.marcadorLocal : this.marcadorVisita;
    }
}