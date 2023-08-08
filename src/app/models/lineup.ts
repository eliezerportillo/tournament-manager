import { Player } from "./player";

export interface LineUp extends Player {
    titular: number;
    startging: boolean;
}