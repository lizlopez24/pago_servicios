import { TestBed } from '@angular/core/testing';
import { ConsulPago } from './consul-pago';


describe('ConsulPago', () => {
  let service: ConsulPago;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsulPago);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
