jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { InfluenciadorService } from '../service/influenciador.service';
import { IInfluenciador, Influenciador } from '../influenciador.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { InfluenciadorUpdateComponent } from './influenciador-update.component';

describe('Component Tests', () => {
  describe('Influenciador Management Update Component', () => {
    let comp: InfluenciadorUpdateComponent;
    let fixture: ComponentFixture<InfluenciadorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let influenciadorService: InfluenciadorService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [InfluenciadorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(InfluenciadorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(InfluenciadorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      influenciadorService = TestBed.inject(InfluenciadorService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const influenciador: IInfluenciador = { id: 456 };
        const user: IUser = { id: 13820 };
        influenciador.user = user;

        const userCollection: IUser[] = [{ id: 8136 }];
        spyOn(userService, 'query').and.returnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        spyOn(userService, 'addUserToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ influenciador });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const influenciador: IInfluenciador = { id: 456 };
        const user: IUser = { id: 62330 };
        influenciador.user = user;

        activatedRoute.data = of({ influenciador });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(influenciador));
        expect(comp.usersSharedCollection).toContain(user);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const influenciador = { id: 123 };
        spyOn(influenciadorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ influenciador });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: influenciador }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(influenciadorService.update).toHaveBeenCalledWith(influenciador);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const influenciador = new Influenciador();
        spyOn(influenciadorService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ influenciador });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: influenciador }));
        saveSubject.complete();

        // THEN
        expect(influenciadorService.create).toHaveBeenCalledWith(influenciador);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const influenciador = { id: 123 };
        spyOn(influenciadorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ influenciador });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(influenciadorService.update).toHaveBeenCalledWith(influenciador);
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
    });
  });
});
