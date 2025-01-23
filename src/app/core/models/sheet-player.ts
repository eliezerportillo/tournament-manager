import { IPlayer } from "./player";

export interface SheetPlayer extends IPlayer {
    attended: boolean;
    noAlinea: boolean;
}
