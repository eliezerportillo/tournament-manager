import { Component, EventEmitter, Output } from '@angular/core';
import { ModalService } from '@app-core/services/modal.service';

@Component({
  selector: 'app-delete-button',
  templateUrl: './delete-button.component.html',
  styleUrls: ['./delete-button.component.scss']
})
export class DeleteButtonComponent {
  @Output() deleteConfirmed = new EventEmitter<void>();

  constructor(private confirmationDialogService: ModalService) {}

  openConfirmationDialog() {
    this.confirmationDialogService.confirm('¿Estás seguro de que deseas eliminar?').subscribe(result => {
      if (result) {
        this.deleteConfirmed.emit();
      }
    });
  }
}
