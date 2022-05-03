import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IEmpresa, Empresa } from '../empresa.model';
import { EmpresaService } from '../service/empresa.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IInfluenciador } from 'app/entities/influenciador/influenciador.model';
import { InfluenciadorService } from 'app/entities/influenciador/service/influenciador.service';

@Component({
  selector: 'jhi-empresa-update',
  templateUrl: './empresa-update.component.html',
})
export class EmpresaUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  influenciadorsSharedCollection: IInfluenciador[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    regiao: [],
    nicho: [],
    site: [null, []],
    user: [],
    influenciadors: [],
  });

  constructor(
    protected empresaService: EmpresaService,
    protected userService: UserService,
    protected influenciadorService: InfluenciadorService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empresa }) => {
      this.updateForm(empresa);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empresa = this.createFromForm();
    if (empresa.id !== undefined) {
      this.subscribeToSaveResponse(this.empresaService.update(empresa));
    } else {
      this.subscribeToSaveResponse(this.empresaService.create(empresa));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackInfluenciadorById(index: number, item: IInfluenciador): number {
    return item.id!;
  }

  getSelectedInfluenciador(option: IInfluenciador, selectedVals?: IInfluenciador[]): IInfluenciador {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpresa>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(empresa: IEmpresa): void {
    this.editForm.patchValue({
      id: empresa.id,
      nome: empresa.nome,
      regiao: empresa.regiao,
      nicho: empresa.nicho,
      site: empresa.site,
      user: empresa.user,
      influenciadors: empresa.influenciadors,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, empresa.user);
    this.influenciadorsSharedCollection = this.influenciadorService.addInfluenciadorToCollectionIfMissing(
      this.influenciadorsSharedCollection,
      ...(empresa.influenciadors ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.influenciadorService
      .query()
      .pipe(map((res: HttpResponse<IInfluenciador[]>) => res.body ?? []))
      .pipe(
        map((influenciadors: IInfluenciador[]) =>
          this.influenciadorService.addInfluenciadorToCollectionIfMissing(
            influenciadors,
            ...(this.editForm.get('influenciadors')!.value ?? [])
          )
        )
      )
      .subscribe((influenciadors: IInfluenciador[]) => (this.influenciadorsSharedCollection = influenciadors));
  }

  protected createFromForm(): IEmpresa {
    return {
      ...new Empresa(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      regiao: this.editForm.get(['regiao'])!.value,
      nicho: this.editForm.get(['nicho'])!.value,
      site: this.editForm.get(['site'])!.value,
      user: this.editForm.get(['user'])!.value,
      influenciadors: this.editForm.get(['influenciadors'])!.value,
    };
  }
}
