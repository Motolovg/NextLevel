jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmpresaService } from '../service/empresa.service';
import { IEmpresa, Empresa } from '../empresa.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IInfluenciador } from 'app/entities/influenciador/influenciador.model';
import { InfluenciadorService } from 'app/entities/influenciador/service/influenciador.service';

import { EmpresaUpdateComponent } from './empresa-update.component';

describe('Component Tests', () => {
  describe('Empresa Management Update Component', () => {
    let comp: EmpresaUpdateComponent;
    let fixture: ComponentFixture<EmpresaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let empresaService: EmpresaService;
    let userService: UserService;
    let influenciadorService: InfluenciadorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmpresaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmpresaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmpresaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      empresaService = TestBed.inject(EmpresaService);
      userService = TestBed.inject(UserService);
      influenciadorService = TestBed.inject(InfluenciadorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const empresa: IEmpresa = { id: 456 };
        const user: IUser = { id: 27699 };
        empresa.user = user;

        const userCollection: IUser[] = [{ id: 87926 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Influenciador query and add missing value', () => {
        const empresa: IEmpresa = { id: 456 };
        const influenciadors: IInfluenciador[] = [{ id: 89654 }];
        empresa.influenciadors = influenciadors;

        const influenciadorCollection: IInfluenciador[] = [{ id: 26325 }];
        spyOn(influenciadorService, 'query').and.returnValue(of(new HttpResponse({ body: influenciadorCollection })));
        const additionalInfluenciadors = [...influenciadors];
        const expectedCollection: IInfluenciador[] = [...additionalInfluenciadors, ...influenciadorCollection];
        spyOn(influenciadorService, 'addInfluenciadorToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        expect(influenciadorService.query).toHaveBeenCalled();
        expect(influenciadorService.addInfluenciadorToCollectionIfMissing).toHaveBeenCalledWith(
          influenciadorCollection,
          ...additionalInfluenciadors
        );
        expect(comp.influenciadorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const empresa: IEmpresa = { id: 456 };
        const user: IUser = { id: 47918 };
        empresa.user = user;
        const influenciadors: IInfluenciador = { id: 89403 };
        empresa.influenciadors = [influenciadors];

        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(empresa));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.influenciadorsSharedCollection).toContain(influenciadors);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empresa = { id: 123 };
        spyOn(empresaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empresa }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(empresaService.update).toHaveBeenCalledWith(empresa);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empresa = new Empresa();
        spyOn(empresaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empresa }));
        saveSubject.complete();

        // THEN
        expect(empresaService.create).toHaveBeenCalledWith(empresa);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const empresa = { id: 123 };
        spyOn(empresaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ empresa });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(empresaService.update).toHaveBeenCalledWith(empresa);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackInfluenciadorById', () => {
        it('Should return tracked Influenciador primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackInfluenciadorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedInfluenciador', () => {
        it('Should return option if no Influenciador is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedInfluenciador(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Influenciador for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedInfluenciador(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Influenciador is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedInfluenciador(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
