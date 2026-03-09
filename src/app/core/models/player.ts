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
  faltas?: number;

  capitan?: boolean | number;
  portero?: number;
  noBautizado?: boolean | number;
  otraDenominacion?: boolean | number;
  correo?: string;
  fechaNacimiento?: number;
  dateBirth: Date | null;
  iglesia?: string; // Church information

  noAlinea: boolean | number;
  celular?: string;
  status?: string; // Player status: 'Activo', 'INACTIVO', etc.
  deletedAt?: Date; // When the player was deleted (for INACTIVO players)
  deletedBy?: string; // Who deleted the player (for INACTIVO players)
}

export enum PlayerType {
  portero = 'portero',
  defensa = 'defensa',
  medio = 'medio',
  delantero = 'delantero',
}

export class Player implements IPlayer {
  /**
   * Static helper to validate if a player (interface) is a captain
   * Accepts both boolean true and number 1 as valid captain values
   */
  static isCaptain(player: IPlayer): boolean {
    return player.capitan === true || player.capitan === 1;
  }

  constructor(player: IPlayer) {
    this.equipo = player.equipo;
    this.jugador = player.jugador ?? '';
    this.name = player.name ?? player.jugador ?? '';
    this.amarillas = player.amarillas;
    this.rojas = player.rojas;
    this.goles = player.goles;
    this.autogoles = player.autogoles;
    this.asistencias = player.asistencias;
    this.faltas = player.faltas;
    this.capitan = player.capitan;
    this.portero = player.portero;
    this.noBautizado = player.noBautizado;
    this.otraDenominacion = player.otraDenominacion;
    this.correo = player.correo;
    this.iglesia = player.iglesia;
    this.id = player.id;
    this.fechaNacimiento = player.fechaNacimiento;
    this.dateBirth = player.dateBirth;
    this.numero = player.numero;
    this.noAlinea = player.noAlinea;
    this.celular = player.celular;
    this.status = player.status;
    this.deletedAt = player.deletedAt;
    this.deletedBy = player.deletedBy;
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
  faltas?: number | undefined;
  capitan?: boolean | number | undefined;
  portero?: number | undefined;
  noBautizado?: boolean | undefined | number;
  otraDenominacion?: boolean | number | undefined;
  correo?: string | undefined;
  iglesia?: string | undefined;
  id?: any;
  fechaNacimiento: number | undefined;
  dateBirth: Date | null;
  celular?: string | undefined;
  status?: string | undefined;
  deletedAt?: Date | undefined;
  deletedBy?: string | undefined;

  /**
   * Validates if this player is a captain
   * Accepts both boolean true and number 1 as valid captain values
   */
  isCaptain(): boolean {
    return this.capitan === true || this.capitan === 1;
  }
}
