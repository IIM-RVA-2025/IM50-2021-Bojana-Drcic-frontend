import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RezervacijaComponent } from './rezervacija.component';

describe('RezervacijaComponent', () => {
  let component: RezervacijaComponent;
  let fixture: ComponentFixture<RezervacijaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RezervacijaComponent]
    });
    fixture = TestBed.createComponent(RezervacijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
