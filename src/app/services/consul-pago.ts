import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Pago{
  descripcion:string,
  fechaVencimiento:string,
  numeroContrato:string,
  valorPagar:number  
}

@Injectable({
  providedIn: 'root',
})
export class ConsulPago {
  private apiUrl='http://localhost:8080/pago-service/api/consulta'

    constructor(private http:HttpClient){}

  getPago(contrato: string): Observable<Pago>{
    console.log(contrato);
    return this.http.get<Pago>(`${this.apiUrl}/${contrato}`);
  }
}
