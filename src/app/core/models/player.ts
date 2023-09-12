import { IEntity } from "./entity";

export interface Player extends IEntity {
    equipo: string;
    jugador: string;
    amarillas?: number;
    rojas?: number;
    goles?: number;

    capitan?: boolean;
    portero?: number;
    noBautizado?: boolean;
    correo?: string;
}

export enum PlayerType {
    portero = 'portero',
    defensa = 'defensa',
    medio = 'medio',
    delantero = 'delantero'
}
