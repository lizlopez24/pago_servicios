import { TestBed } from '@angular/core/testing';

import { Pagar } from './pagar';

describe('Pagar', () => {
  let service: Pagar;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Pagar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
