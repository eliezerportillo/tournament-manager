import { IPlayer } from './player';

export interface Stats {
  goals: IPlayer[];
  yellows: IPlayer[];
  reds: IPlayer[];
  faults: IPlayer[];
  assists: IPlayer[];
}
