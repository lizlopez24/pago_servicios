import { Component } from '@angular/core';
import { Catalogo } from '../../services/catalogo';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsulPago } from '../../services/consul-pago';

@Component({
  selector: 'app-pago',
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago {
  consulForm!: FormGroup;
  constructor(private fb: FormBuilder,private catalogo: Catalogo, private consul:ConsulPago){};
  tipos: Catalogo[] = [];

  ngOnInit():void{
    this.consulForm = this.fb.group({
      servicioId: ['', Validators.required],
      numeroContrato: ['', Validators.required],
    });

    this.cargarCatalogo("SEVBAS");
  }

  cargarCatalogo(cod:string):void{
    this.catalogo.getTipos(cod).subscribe({
      next:(response)=>{
        this.tipos=response
      },
      error:(err)=>{
        console.log('Error al ejecutar', err)
      }
    })
  }

  consultar():void{
      if (this.consulForm.invalid) {
      this.consulForm.markAllAsTouched();
      return;
    }
  const payload = this.consulForm.value;

  this.consul.getPago(payload.numeroContrato).subscribe({
      next: (resp) => {
        console.log('Respuesta del backend:', resp);
      },
      error: (err) => {
        console.error('Error al consultar el pago', err);
      },
    });
  }

}
