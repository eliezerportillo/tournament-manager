import { Formation } from "./formation";
import { Markable } from "./lineup";
import { PlayerType } from "./player";

export class FutSystemBuilder {
    private PLACEHOLDER = 'Seleccionar';
    playerTypes: { [key: number]: PlayerType } = {
        1: PlayerType.portero,
        2: PlayerType.defensa,
        3: PlayerType.medio,
        4: PlayerType.delantero
    }

    lineup: Markable[][];
    private _players: Markable[];
    constructor(public formation: Formation) {
        this.lineup = [];
        this._players = [];

        if (formation.count != 7) {
            throw 'Invalid system distribution';
        }
    }

    buildSystem() {
        let counter = 0;

        this.formation.forEach((n, i) => {
            const positions: Markable[] = [];
            for (let index = 0; index < n; index++) {
                const player: Markable = {
                    equipo: 'team',
                    jugador: this.PLACEHOLDER,
                    playerType: this.playerTypes[i + 1],
                    order: ++counter,
                    marked: false
                }
                positions.push(player)
            }
            this.lineup.push(positions);
        });

        this._players = this.lineup.reduce((acc, curr) => acc.concat(curr), []);

    }

    getSystem(): Markable[][] {
        return this.lineup;
    }

    isCompleted(): boolean {
        return this.checkAllMarked(this.lineup);
    }

    checkAllMarked(arr: any[][]): boolean {
        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr[i].length; j++) {
                if (!arr[i][j].marked) {
                    return false;
                } else if (Array.isArray(arr[i][j])) {
                    if (!this.checkAllMarked(arr[i][j])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    get players() {

        return this._players;
    }
}


