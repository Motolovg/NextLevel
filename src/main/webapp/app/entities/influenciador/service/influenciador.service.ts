import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInfluenciador, getInfluenciadorIdentifier } from '../influenciador.model';

export type EntityResponseType = HttpResponse<IInfluenciador>;
export type EntityArrayResponseType = HttpResponse<IInfluenciador[]>;

@Injectable({ providedIn: 'root' })
export class InfluenciadorService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/influenciadors');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(influenciador: IInfluenciador): Observable<EntityResponseType> {
    return this.http.post<IInfluenciador>(this.resourceUrl, influenciador, { observe: 'response' });
  }

  update(influenciador: IInfluenciador): Observable<EntityResponseType> {
    return this.http.put<IInfluenciador>(`${this.resourceUrl}/${getInfluenciadorIdentifier(influenciador) as number}`, influenciador, {
      observe: 'response',
    });
  }

  partialUpdate(influenciador: IInfluenciador): Observable<EntityResponseType> {
    return this.http.patch<IInfluenciador>(`${this.resourceUrl}/${getInfluenciadorIdentifier(influenciador) as number}`, influenciador, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInfluenciador>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInfluenciador[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addInfluenciadorToCollectionIfMissing(
    influenciadorCollection: IInfluenciador[],
    ...influenciadorsToCheck: (IInfluenciador | null | undefined)[]
  ): IInfluenciador[] {
    const influenciadors: IInfluenciador[] = influenciadorsToCheck.filter(isPresent);
    if (influenciadors.length > 0) {
      const influenciadorCollectionIdentifiers = influenciadorCollection.map(
        influenciadorItem => getInfluenciadorIdentifier(influenciadorItem)!
      );
      const influenciadorsToAdd = influenciadors.filter(influenciadorItem => {
        const influenciadorIdentifier = getInfluenciadorIdentifier(influenciadorItem);
        if (influenciadorIdentifier == null || influenciadorCollectionIdentifiers.includes(influenciadorIdentifier)) {
          return false;
        }
        influenciadorCollectionIdentifiers.push(influenciadorIdentifier);
        return true;
      });
      return [...influenciadorsToAdd, ...influenciadorCollection];
    }
    return influenciadorCollection;
  }
}
