import { INamedObject } from "./named.object";

export interface IPlayer extends INamedObject {
    equipo: string;
    jugador: string;
    amarillas?: number;
    rojas?: number;
    goles?: number;

    capitan?: boolean;
    portero?: number;
    noBautizado?: boolean;
    correo?: string;
    fechaNacimiento?: number;
    dateBirth: Date | null;
}

export enum PlayerType {
    portero = 'portero',
    defensa = 'defensa',
    medio = 'medio',
    delantero = 'delantero'
}


export class Player implements IPlayer {
    constructor(player: IPlayer) {
        this.equipo = player.equipo;
        this.jugador = player.jugador ?? '';
        this.name = player.name ?? player.jugador ?? '';
        this.amarillas = player.amarillas;
        this.rojas = player.rojas;
        this.goles = player.goles;
        this.capitan = player.capitan;
        this.portero = player.portero;
        this.noBautizado = player.noBautizado;
        this.correo = player.correo;
        this.id = player.id;
        this.fechaNacimiento = player.fechaNacimiento;
        this.dateBirth = player.dateBirth;
    }

    jugador: string;
    equipo: string;
    name: string;
    amarillas?: number | undefined;
    rojas?: number | undefined;
    goles?: number | undefined;
    capitan?: boolean | undefined;
    portero?: number | undefined;
    noBautizado?: boolean | undefined;
    correo?: string | undefined;
    id?: any;
    fechaNacimiento: number | undefined;
    dateBirth: Date | null;
}
