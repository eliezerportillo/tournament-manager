import { IEntity } from "./entity";

export interface ISponsor extends IEntity {
    name: string;
    priority: number;
    logoUrl: string;
    website?: string;
}