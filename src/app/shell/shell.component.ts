import { Component } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  titulo: string;
  cargando: boolean;
  constructor(){
    this.titulo = "Asociación de Futbol Cristiana";
    this.cargando = false;
  }
}
