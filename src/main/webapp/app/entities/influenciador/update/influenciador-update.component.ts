import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IInfluenciador, Influenciador } from '../influenciador.model';
import { InfluenciadorService } from '../service/influenciador.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

@Component({
  selector: 'jhi-influenciador-update',
  templateUrl: './influenciador-update.component.html',
})
export class InfluenciadorUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    email: [null, []],
    regiao: [],
    bio: [],
    redes: [],
    user: [],
  });

  constructor(
    protected influenciadorService: InfluenciadorService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ influenciador }) => {
      this.updateForm(influenciador);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const influenciador = this.createFromForm();
    if (influenciador.id !== undefined) {
      this.subscribeToSaveResponse(this.influenciadorService.update(influenciador));
    } else {
      this.subscribeToSaveResponse(this.influenciadorService.create(influenciador));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInfluenciador>>): void {
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

  protected updateForm(influenciador: IInfluenciador): void {
    this.editForm.patchValue({
      id: influenciador.id,
      nome: influenciador.nome,
      email: influenciador.email,
      regiao: influenciador.regiao,
      bio: influenciador.bio,
      redes: influenciador.redes,
      user: influenciador.user,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, influenciador.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IInfluenciador {
    return {
      ...new Influenciador(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      email: this.editForm.get(['email'])!.value,
      regiao: this.editForm.get(['regiao'])!.value,
      bio: this.editForm.get(['bio'])!.value,
      redes: this.editForm.get(['redes'])!.value,
      user: this.editForm.get(['user'])!.value,
    };
  }
}
