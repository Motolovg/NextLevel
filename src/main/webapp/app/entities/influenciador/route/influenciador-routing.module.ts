import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InfluenciadorComponent } from '../list/influenciador.component';
import { InfluenciadorDetailComponent } from '../detail/influenciador-detail.component';
import { InfluenciadorUpdateComponent } from '../update/influenciador-update.component';
import { InfluenciadorRoutingResolveService } from './influenciador-routing-resolve.service';

const influenciadorRoute: Routes = [
  {
    path: '',
    component: InfluenciadorComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InfluenciadorDetailComponent,
    resolve: {
      influenciador: InfluenciadorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InfluenciadorUpdateComponent,
    resolve: {
      influenciador: InfluenciadorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InfluenciadorUpdateComponent,
    resolve: {
      influenciador: InfluenciadorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(influenciadorRoute)],
  exports: [RouterModule],
})
export class InfluenciadorRoutingModule {}
