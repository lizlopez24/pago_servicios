import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Response{
  codigo: number,
  mensaje: string,
  data: ConsulPago
}
export interface ConsulPago{
  descripcion:string,
  fechaVencimiento:string,
  numeroContrato:string,
  valorPagar:number  
}

export interface ClienteCuenta{
  idcliente:number,
  identificacion:string,
  nombre:string,
  idcuenta:number,
  numero:number,
  saldo:number
}

@Injectable({
  providedIn: 'root',
})
export class ConsulPago {
  private apiUrl='http://localhost:8080/pago-service/api/consulta'

    constructor(private http:HttpClient){}

  getPago(contrato: string): Observable<Response>{
    return this.http.get<Response>(`${this.apiUrl}/${contrato}`);
  }

  getInfoCliente(cedula: string): Observable<ClienteCuenta>{
    return this.http.get<ClienteCuenta>(`${this.apiUrl}/login/${cedula}`);
  }

}
