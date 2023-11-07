import { IEntity } from "./entity";

export interface IBanner extends IEntity {
    phoneNumber: string;
    autoMessage: string;
    imageUrl: string;
    active: boolean;
}