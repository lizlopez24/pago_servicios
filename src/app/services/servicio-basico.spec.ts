import { TestBed } from '@angular/core/testing';

import { ServicioBasico } from './servicio-basico';

describe('ServicioBasico', () => {
  let service: ServicioBasico;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioBasico);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
