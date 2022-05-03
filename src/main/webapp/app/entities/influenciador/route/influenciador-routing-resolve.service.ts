import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInfluenciador, Influenciador } from '../influenciador.model';
import { InfluenciadorService } from '../service/influenciador.service';

@Injectable({ providedIn: 'root' })
export class InfluenciadorRoutingResolveService implements Resolve<IInfluenciador> {
  constructor(protected service: InfluenciadorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInfluenciador> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((influenciador: HttpResponse<Influenciador>) => {
          if (influenciador.body) {
            return of(influenciador.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Influenciador());
  }
}
