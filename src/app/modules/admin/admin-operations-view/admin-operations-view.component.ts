import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CleanOldBadgesCommand } from '@app-core/services/clean-old-badges.command';
import { ModalService } from '@app-core/services/modal.service';

@Component({
  selector: 'app-admin-operations-view',
  templateUrl: './admin-operations-view.component.html',
  styleUrls: ['./admin-operations-view.component.scss']
})
export class AdminOperationsViewComponent {

  cleanOldBadgesCommand = inject(CleanOldBadgesCommand)
  modalService = inject(ModalService);
  snackBar = inject(MatSnackBar);

  cleanOldBadges() {
    this.modalService.confirm("Seguro que deseas eliminar las credenciales de jugadores viejos, ésto eliminará credenciales que no estan registrados en la lista de jugadores.").subscribe(result => {
      if (result) {
        this.cleanOldBadgesCommand.execute()
          .then((deletedCount) => {
            this.snackBar.open(deletedCount + ' Credenciales eliminadas.', 'OK', { duration: 3000 });
          });
      }
    })
  }
}
