// error-handler.service.ts
import { ErrorHandler, Injectable, Injector, inject } from '@angular/core';
import { ModalService } from '@app-core/services/modal.service';
import { ErrorHandlerModalComponent } from 'app/error-handler-modal/error-handler-modal.component';

@Injectable()
export class CustomErrorHandler extends ErrorHandler {
    modalService = inject(ModalService);

    constructor() {
        super();
    }

    override handleError(error: any): void {

        this.modalService.open(ErrorHandlerModalComponent, { error: error?.message || 'Error desconocido:\n ' + JSON.stringify(error) })

        // Puedes agregar más acciones aquí según tus necesidades,
        // como enviar informes de errores a un servicio de monitoreo.
        super.handleError(error);
    }
}
