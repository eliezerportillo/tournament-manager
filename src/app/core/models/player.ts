import { INamedObject } from './named.object';

export interface IPlayer extends INamedObject {
  numero: string;
  equipo: string;
  jugador: string;
  amarillas?: number;
  rojas?: number;
  goles?: number;
  autogoles?: number;
  asistencias?: number;

  capitan?: boolean | number;
  portero?: number;
  noBautizado?: boolean | number;
  correo?: string;
  fechaNacimiento?: number;
  dateBirth: Date | null;

  noAlinea: boolean | number;
  celular?: string;
}

export enum PlayerType {
  portero = 'portero',
  defensa = 'defensa',
  medio = 'medio',
  delantero = 'delantero',
}

export class Player implements IPlayer {
  constructor(player: IPlayer) {
    this.equipo = player.equipo;
    this.jugador = player.jugador ?? '';
    this.name = player.name ?? player.jugador ?? '';
    this.amarillas = player.amarillas;
    this.rojas = player.rojas;
    this.goles = player.goles;
    this.autogoles = player.autogoles;
    this.asistencias = player.asistencias;
    this.capitan = player.capitan;
    this.portero = player.portero;
    this.noBautizado = player.noBautizado;
    this.correo = player.correo;
    this.id = player.id;
    this.fechaNacimiento = player.fechaNacimiento;
    this.dateBirth = player.dateBirth;
    this.numero = player.numero;
    this.noAlinea = player.noAlinea;
    this.celular = player.celular;
  }

  numero: string;
  noAlinea: boolean | number;

  jugador: string;
  equipo: string;
  name: string;
  amarillas?: number | undefined;
  rojas?: number | undefined;
  goles?: number;
  autogoles?: number | undefined;
  asistencias?: number | undefined;
  capitan?: boolean | number | undefined;
  portero?: number | undefined;
  noBautizado?: boolean | undefined | number;
  correo?: string | undefined;
  id?: any;
  fechaNacimiento: number | undefined;
  dateBirth: Date | null;
  celular?: string | undefined;
}
