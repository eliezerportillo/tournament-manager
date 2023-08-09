import { Player, PlayerType } from "./player";

export interface LineUp {
    equipo: string;
    jugador: string;
    order: number;
    startging?: boolean;
    playerType?: PlayerType;
}