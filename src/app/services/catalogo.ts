import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Catalogo{
  id:number,
  codigo:string,
  nombre:string
}

@Injectable({
  providedIn: 'root',
})
export class Catalogo {
  private apiUrl='http://localhost:8080/pago-service/api/catalogos'
  
  constructor(private http:HttpClient){}

  getTipos(catalog: string): Observable<Catalogo[]>{
    return this.http.get<Catalogo[]>(`${this.apiUrl}/${catalog}`);
  }

}
