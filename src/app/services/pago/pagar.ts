import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface PagoRequest {
  contrato: string;
  valorPagar: number;
  fechaVencimiento: string;
  descripcion: string;
  fechaPago: string;
  saldo:number;
  idcuenta:number;
}

export interface PagoResponse {
  ok: boolean;
  message?: string;
  idGenerado?: number;
  saldoActual?: number;
}

@Injectable({
  providedIn: 'root',
})
export class Pagar {
  private apiUrl='http://localhost:8080/pago-service/api/pago'

  constructor(private http: HttpClient) {}

    registrarPago(body: PagoRequest): Observable<PagoResponse> {
    return this.http.post<PagoResponse>(`${this.apiUrl}/registrar`, body);
  }
}
