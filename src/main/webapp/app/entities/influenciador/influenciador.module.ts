import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { InfluenciadorComponent } from './list/influenciador.component';
import { InfluenciadorDetailComponent } from './detail/influenciador-detail.component';
import { InfluenciadorUpdateComponent } from './update/influenciador-update.component';
import { InfluenciadorDeleteDialogComponent } from './delete/influenciador-delete-dialog.component';
import { InfluenciadorRoutingModule } from './route/influenciador-routing.module';

@NgModule({
  imports: [SharedModule, InfluenciadorRoutingModule],
  declarations: [InfluenciadorComponent, InfluenciadorDetailComponent, InfluenciadorUpdateComponent, InfluenciadorDeleteDialogComponent],
  entryComponents: [InfluenciadorDeleteDialogComponent],
})
export class InfluenciadorModule {}
