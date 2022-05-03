import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InfluenciadorDetailComponent } from './influenciador-detail.component';

describe('Component Tests', () => {
  describe('Influenciador Management Detail Component', () => {
    let comp: InfluenciadorDetailComponent;
    let fixture: ComponentFixture<InfluenciadorDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [InfluenciadorDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ influenciador: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(InfluenciadorDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(InfluenciadorDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load influenciador on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.influenciador).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
