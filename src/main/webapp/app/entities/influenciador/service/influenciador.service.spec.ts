import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInfluenciador, Influenciador } from '../influenciador.model';

import { InfluenciadorService } from './influenciador.service';

describe('Service Tests', () => {
  describe('Influenciador Service', () => {
    let service: InfluenciadorService;
    let httpMock: HttpTestingController;
    let elemDefault: IInfluenciador;
    let expectedResult: IInfluenciador | IInfluenciador[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(InfluenciadorService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        email: 'AAAAAAA',
        regiao: 'AAAAAAA',
        bio: 'AAAAAAA',
        redes: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Influenciador', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Influenciador()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Influenciador', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            email: 'BBBBBB',
            regiao: 'BBBBBB',
            bio: 'BBBBBB',
            redes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Influenciador', () => {
        const patchObject = Object.assign(
          {
            email: 'BBBBBB',
            bio: 'BBBBBB',
          },
          new Influenciador()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Influenciador', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            email: 'BBBBBB',
            regiao: 'BBBBBB',
            bio: 'BBBBBB',
            redes: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Influenciador', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addInfluenciadorToCollectionIfMissing', () => {
        it('should add a Influenciador to an empty array', () => {
          const influenciador: IInfluenciador = { id: 123 };
          expectedResult = service.addInfluenciadorToCollectionIfMissing([], influenciador);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(influenciador);
        });

        it('should not add a Influenciador to an array that contains it', () => {
          const influenciador: IInfluenciador = { id: 123 };
          const influenciadorCollection: IInfluenciador[] = [
            {
              ...influenciador,
            },
            { id: 456 },
          ];
          expectedResult = service.addInfluenciadorToCollectionIfMissing(influenciadorCollection, influenciador);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Influenciador to an array that doesn't contain it", () => {
          const influenciador: IInfluenciador = { id: 123 };
          const influenciadorCollection: IInfluenciador[] = [{ id: 456 }];
          expectedResult = service.addInfluenciadorToCollectionIfMissing(influenciadorCollection, influenciador);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(influenciador);
        });

        it('should add only unique Influenciador to an array', () => {
          const influenciadorArray: IInfluenciador[] = [{ id: 123 }, { id: 456 }, { id: 4100 }];
          const influenciadorCollection: IInfluenciador[] = [{ id: 123 }];
          expectedResult = service.addInfluenciadorToCollectionIfMissing(influenciadorCollection, ...influenciadorArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const influenciador: IInfluenciador = { id: 123 };
          const influenciador2: IInfluenciador = { id: 456 };
          expectedResult = service.addInfluenciadorToCollectionIfMissing([], influenciador, influenciador2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(influenciador);
          expect(expectedResult).toContain(influenciador2);
        });

        it('should accept null and undefined values', () => {
          const influenciador: IInfluenciador = { id: 123 };
          expectedResult = service.addInfluenciadorToCollectionIfMissing([], null, influenciador, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(influenciador);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
