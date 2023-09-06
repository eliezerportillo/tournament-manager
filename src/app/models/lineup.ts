import { IEntity } from "./entity";
import { PlayerType } from "./player";

export interface LineUp extends IEntity {
    equipo: string;
    jugador: string;
    order: number;
    startging?: boolean;
    playerType?: PlayerType;
}

export interface Markable extends LineUp {
    marked: boolean;
}