import { Component, EventEmitter, inject } from '@angular/core';
import { AngularFirestore, QueryFn } from '@angular/fire/compat/firestore';
import { IMatch } from '@app-core/models/match';
import { IPlayer } from '@app-core/models/player';
import { ITeam } from '@app-core/models/team';
import { AccountService } from '@app-core/services/account.service';
import { firstValueFrom, map, tap } from 'rxjs';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-export-excel',
  templateUrl: './export-excel.component.html',
  styleUrls: ['./export-excel.component.scss'],
})
export class ExportExcelComponent {
  db = inject(AngularFirestore);
  accountService = inject(AccountService);

  collections: IExportedCollection[] = [
    new TeamExportedCollection('Equipos', (ref) => ref.orderBy('Pts', 'desc')),
    new PlayerExportedCollection('Jugadores', (ref) => ref.orderBy('equipo')),
    new MatchExportedCollection('Partidos', (ref) => ref.orderBy('fecha')),
  ];
  exportingCompleted = false;
  loading = false;

  progressReporter = new EventEmitter<string>();

  statusItems: string[] = [];

  constructor() {
    this.progressReporter.subscribe((status) => this.statusItems.push(status));
  }

  async handleExport() {
    this.loading = true;

    await this.startExporting();

    this.loading = false;
    this.exportingCompleted = true;
  }

  async startExporting(): Promise<void> {
    const workbook = XLSX.utils.book_new();

    for (const collection of this.collections) {
      let f_collection = this.db.collection<any>(collection.collectionName);
      if (collection.query) {
        f_collection = this.db.collection<any>(
          collection.collectionName,
          collection.query
        );
      }
      const data$ = f_collection.snapshotChanges().pipe(
        tap((items) => {
          this.progressReporter.emit(
            `Información de ${items.length} ${collection.collectionName}`
          );
        }),
        map((actions) =>
          actions.map((action) => {
            const data = action.payload.doc.data();
            return collection.map(data);
          })
        )
      );
      const data = await firstValueFrom(data$);
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        collection.collectionName
      );
    }
    // Save the workbook to a file
    this.progressReporter.emit(`Descargando archivo.`);
    const date = new Date().toISOString();
    const fileName = `Exportación_${this.accountService.tournamentName}_${date}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  }
}

interface IExportedCollection {
  query: QueryFn;
  collectionName: string;
  map(data: any): any[];
}

abstract class ExportedCollection<T> implements IExportedCollection {
  constructor(public collectionName: string, public query: QueryFn) {}

  abstract map(data: T): any;
}

class TeamExportedCollection extends ExportedCollection<ITeam> {
  override map(x: ITeam): any {
    return {
      nombre: x.nombre,
      grupo: x.grupo,
      PJ: x.PJ,
      G: x.G,
      E: x.E,
      P: x.P,
      GF: x.GF,
      GC: x.GC,
      DG: x.DG,
      Pts: x.Pts,
      tendencia: x.tendencia,
    };
  }
}

class PlayerExportedCollection extends ExportedCollection<IPlayer> {
  override map(x: IPlayer): any {
    return {
      equipo: x.equipo,
      numero: x.numero,
      jugador: x.jugador,
      fechaNacimiento: x.fechaNacimiento,
      capitan: x.capitan ? 1 : 0,
      portero: x.portero ? 1 : 0,
      noBautizado: x.noBautizado,
      otraDenominacion: x.otraDenominacion,
      amarillas: x.amarillas,
      rojas: x.rojas,
      goles: x.goles,
      autogoles: x.autogoles,
      asistencias: x.asistencias,
      correo: x.correo,
      celular: x.celular,
    };
  }
}

class MatchExportedCollection extends ExportedCollection<IMatch> {
  override map(x: IMatch): any {
    return {
      fase: x.fase,
      etapa: x.etapa,
      ordenEtapa: x.ordenEtapa,
      esClasificacion: x.esClasificacion,
      numero: x.numero,
      local: x.local,
      marcadorLocal: x.marcadorLocal,
      marcadorVisita: x.marcadorVisita,
      visita: x.visita,
      fecha: x.fecha,
      hora: x.hora,
      campo: x.campo,
      comisionado: x.comisionado,
    };
  }
}
