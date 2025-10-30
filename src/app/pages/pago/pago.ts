import { Component } from '@angular/core';
import { Catalogo } from '../../services/catalogo/catalogo';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClienteCuenta, ConsulPago } from '../../services/consulta/consul-pago';
import { Pagar, PagoRequest, PagoResponse } from '../../services/pago/pagar';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-pago',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pago.html',
  styleUrl: './pago.css',
})
export class Pago {
  consulForm!: FormGroup;
  cedulaForm!: FormGroup;

  constructor(private fb: FormBuilder, private catalogo: Catalogo,
    private consul: ConsulPago, private regPago: Pagar) { }

  tipos: Catalogo[] = [];
  usuario: ClienteCuenta | null = null;
  pago: ConsulPago | null = null;

  isLoading = false;
  errorMsg: string | null = null;
  isValidatingCedula = false;

  isPaying = false;
  showReceipt = false;

  receipt: {
    clienteNombre: string;
    servicioNombre: string;
    valorPagado: number;
    fechaVencimiento: string | Date;
    descripcion: string;
    fechaPago: Date;
    saldoActual: number;
    numeroContrato: string;
  } | null = null;

  ngOnInit(): void {
    this.cedulaForm = this.fb.group({
      cedula: ['', [Validators.required]],
    });

    this.consulForm = this.fb.group({
      servicioId: [{ value: '', disabled: true }, Validators.required],
      numeroContrato: [{ value: '', disabled: true }, Validators.required],
    });

    this.cargarCatalogo('SEVBAS');
  }

  cargarCatalogo(cod: string): void {
    this.catalogo.getTipos(cod).subscribe({
      next: (response) => (this.tipos = response),
      error: (err) => console.log('Error al ejecutar', err),
    });
  }

  validarCedula(): void {
    if (this.cedulaForm.invalid) { this.cedulaForm.markAllAsTouched(); return; }
    this.isValidatingCedula = true;
    this.errorMsg = null;
    this.usuario = null;
    this.pago = null;

    const cedula = this.cedulaForm.value.cedula!;

    this.consul
      .getInfoCliente(cedula)
      .pipe(finalize(() => (this.isValidatingCedula = false)))
      .subscribe({
        next: (u) => {
          this.usuario = u;
          if (u.idcliente === 0) {
            this.errorMsg = 'La cédula no existe en el sistema.';
            this.usuario = null;
            this.consulForm.get('servicioId')?.disable();
            this.consulForm.get('numeroContrato')?.disable();
          } else {
            this.consulForm.get('servicioId')?.enable();
            this.consulForm.get('numeroContrato')?.enable();
            this.consulForm.reset({ servicioId: '', numeroContrato: '' });
          }
        },
        error: (e) => {
          this.errorMsg = 'No fue posible validar la cédula.';
          console.error(e);
        }
      });
  }

  consultar(): void {
    if (!this.usuario) { this.errorMsg = 'Primero valida la cédula.'; return; }
    if (this.consulForm.invalid) { this.consulForm.markAllAsTouched(); return; }

    this.isLoading = true;
    this.errorMsg = null;
    this.pago = null;

    const payload = this.consulForm.value;
    this.consul.getPago(payload.numeroContrato)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp) => { 
          if(resp.codigo===200){
            this.pago = resp.data;
          }else{
            this.errorMsg=resp.mensaje
          }
           
        },
        error: (err) => {
          console.error('Error al consultar el pago', err);
          this.errorMsg = 'No fue posible consultar el contrato.';
        },
      });
  }

  pagar(): void {
    if (!this.usuario || !this.pago) { this.errorMsg = 'Falta información para pagar.'; return; }
    const { servicioId, numeroContrato } = this.consulForm.getRawValue();
    if (!servicioId || !numeroContrato) { this.errorMsg = 'Selecciona servicio y contrato.'; return; }
    if (!this.pago.valorPagar || this.pago.valorPagar <= 0) { this.errorMsg = 'No hay valor pendiente.'; return; }

    this.isPaying = true;
    this.errorMsg = null;

    const hoy = new Date();

    const req: PagoRequest = {
      contrato: numeroContrato,
      valorPagar: this.pago.valorPagar,
      fechaVencimiento: this.pago.fechaVencimiento,
      descripcion: this.pago.descripcion,
      fechaPago: hoy.toString(),
      idcuenta: this.usuario.idcuenta,
      saldo: this.usuario.saldo
    };
    this.regPago.registrarPago(req)
      .pipe(finalize(() => (this.isPaying = false)))
      .subscribe({
        next: (resp: PagoResponse) => {

          this.isPaying = false;
          const servName = this.tipos.find(t => String(t.id) === String(servicioId))?.nombre ?? 'Servicio';

          this.receipt = {
            clienteNombre: this.usuario?.nombre || 'Cliente',
            servicioNombre: servName,
            valorPagado: req.valorPagar,
            fechaVencimiento: req.fechaVencimiento,
            descripcion: req.descripcion,
            fechaPago: hoy,
            saldoActual: resp.saldoActual || 0,
            numeroContrato,
          };
          this.showReceipt = true;
        },
        error: (err) => {
          console.error('Error al registrar el pago', err);
          this.errorMsg = 'No fue posible registrar el pago.';
        }
      });
  }

  cerrarRecibo(): void {
    this.showReceipt = false;
    this.receipt = null;
    this.cedulaForm.reset();
    this.consulForm.reset();
    this.consulForm.get('servicioId')?.disable();
    this.consulForm.get('numeroContrato')?.disable();
    this.usuario = null;
    this.pago = null;
    this.errorMsg = null;
    this.isLoading = false;
    this.isValidatingCedula = false;
    this.isPaying = false;
  }

  limpiar(): void {
    this.consulForm.reset();
    this.pago = null;
    this.errorMsg = null;
    this.showReceipt = false;
    this.receipt = null;
  }
}
