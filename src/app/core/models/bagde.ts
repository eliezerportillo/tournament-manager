import { IEntity } from "./entity";

export interface IBadge extends IEntity {
    teamName: string;
    playerName: string;
    photoUrl: string;
}