import { INamedObject } from "./named.object";
import { PlayerType } from "./player";

export interface LineUp extends INamedObject {
    equipo: string;    
    order: number;
    startging?: boolean;
    playerType?: PlayerType;
}

export interface Markable extends LineUp {
    marked: boolean;
}