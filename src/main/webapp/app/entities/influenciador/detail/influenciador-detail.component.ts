import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IInfluenciador } from '../influenciador.model';

@Component({
  selector: 'jhi-influenciador-detail',
  templateUrl: './influenciador-detail.component.html',
})
export class InfluenciadorDetailComponent implements OnInit {
  influenciador: IInfluenciador | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ influenciador }) => {
      this.influenciador = influenciador;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
