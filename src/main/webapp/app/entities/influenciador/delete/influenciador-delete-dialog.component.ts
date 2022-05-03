import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInfluenciador } from '../influenciador.model';
import { InfluenciadorService } from '../service/influenciador.service';

@Component({
  templateUrl: './influenciador-delete-dialog.component.html',
})
export class InfluenciadorDeleteDialogComponent {
  influenciador?: IInfluenciador;

  constructor(protected influenciadorService: InfluenciadorService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.influenciadorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
