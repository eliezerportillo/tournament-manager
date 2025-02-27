import { IEntity } from './entity';

export interface ITeamFairPlayPoint extends IEntity {
  teamName: string;
  points: number;
}
