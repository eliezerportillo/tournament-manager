export interface Player {
    equipo: string;
    jugador: string;
    amarillas?: number;
    rojas?: number;
    goles?: number;

    capitan?: boolean;
    portero?: number;
    noBautizado?: boolean;
    correo?: string;
}

export type PlayerType =
| 'portero'
| 'defensa'
| 'medio'
| 'delantero';