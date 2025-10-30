import { Component } from '@angular/core';
import { Catalogo } from '../../services/catalogo';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ConsulPago } from '../../services/consul-pago';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pago',
  imports:[CommonModule, ReactiveFormsModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago {
  
  constructor(private fb: FormBuilder,private catalogo: Catalogo, private consul:ConsulPago){};

  tipos: Catalogo[] = [];
  
  consulForm!: FormGroup;
  isLoading = false;
  errorMsg: string | null = null;

  pago: ConsulPago | null = null;
  
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

    this.isLoading = true;
    this.errorMsg = null;
    this.pago = null;

  const payload = this.consulForm.value;

  this.consul.getPago(payload.numeroContrato).pipe(finalize(() => (this.isLoading = false))).
  subscribe({
      next: (resp) => {
        this.pago=resp;
      },
      error: (err) => {
        console.error('Error al consultar el pago', err);
      },
    });
  }


    pagar(): void {
    if (!this.pago) return;
    // Aquí puedes redirigir a pasarela o invocar otro endpoint
    // this.pagoSvc.iniciarPago(this.pago).subscribe(...)
    alert('Simulación de pago iniciada.');
  }

    limpiar(): void {
    this.consulForm.reset();
    this.pago = null;
    this.errorMsg = null;
  }
}
