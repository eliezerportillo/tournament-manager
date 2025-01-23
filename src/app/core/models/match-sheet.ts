import { IMatch } from "./match";
import { SheetPlayer } from "./sheet-player";

export interface MatchSheet {
    match: IMatch,
    localPlayers: SheetPlayer[],
    awayPlayers: SheetPlayer[],
    comments: string
}