import { PlayerType } from "./player";

export interface LineUp {
    equipo: string;
    name: string;
    order: number;
    startging?: boolean;
    playerType?: PlayerType;
}

export interface Markable extends LineUp {
    marked: boolean;
}