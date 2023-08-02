export interface Match {
    jornada: string;
    local: string;
    marcadorLocal: number;
    imageUrlLocal: string;
    marcadorVisita: number;
    imageUrlVisita: string;
    visita: string;
    fecha: number;
    date: Date;
    dateTime: Date;
    hour: string;
    hora: number;
    campo: string;
}


export class MatchResult {
    today: Date;
    constructor(private match: Match) {
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

    get winner(): string {
        if (!this.hasWinner) {
            return '';
        }

        return this.marcadorLocal > this.marcadorVisita ? this.match.local : this.match.visita;
    }
}