import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-suscription',
  templateUrl: './suscription.page.html',
  styleUrls: ['./suscription.page.scss'],
})
export class SuscriptionPage implements OnInit {

  public email: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.email = this.usuarioService.getUsuarioActualApp();
  }

  Suscribirse(nombre: any, apellido: any, tarjeta_numero: any, tarjeta_vence: any, codigo_seguridad: any) {

    try {
      //se eliminan caracteres en blanco 
      nombre = nombre.value.toString().trim();
      apellido = apellido.value.toString().trim();
      tarjeta_numero = tarjeta_numero.value.toString().trim();
      tarjeta_vence = tarjeta_vence.value.toString().trim();
      codigo_seguridad = codigo_seguridad.value.toString().trim();

      if (this.Verificar_Datos(nombre, apellido, tarjeta_numero, tarjeta_vence, codigo_seguridad) === true)
        this.usuarioService.Suscribirse()
    } catch (error) {
        //console.log('Error de suscripcion');
    }
  }

  Verificar_Datos(nombre: string, apellido: string, tarjeta_numero: string, tarjeta_vence: string, codigo_seguridad: string): boolean {
    if (nombre === '' || apellido === '' || tarjeta_numero === '' || tarjeta_vence === '' || codigo_seguridad === '') {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'Se deben completar todos los datos'
      );
      return false;
    }


    if (nombre.length < 2 || apellido.length < 2) {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'El nombre y/o apellido parecen incorrectos'
      );
      return false;
    }

    //verificar que solo se ingresan números
    const regexp = new RegExp('^[1-9]\d{0,2}$');
    const result1: boolean = regexp.test(tarjeta_numero);
    const result2: boolean = regexp.test(tarjeta_vence);
    const result3: boolean = regexp.test(codigo_seguridad);
    if (result1 !== true || result2 !== true || result3 !== true) {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'Debe ingresar solamente números para el numero de tarjeta, la fecha de vencimiento y el codigo de seguridad'
      );
      return false;
    }

    if (tarjeta_numero.length != 16) {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'El número de tarjeta ingresado es incorrecto'
      );
      return false;
    }

    if (tarjeta_vence.length != 6) {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'La fecha ingresada es incorrecta'
      );
      return false;
    }

    if (codigo_seguridad.length != 3) {
      this.utilsService.mostrarAlerta(
        'Advertencia',
        'El código de seguridad ingresado es incorrecto'
      );
      return false;
    }
    //todo bien
    return true;
  }

  Cancelar() {
    this.router.navigate(['/login']);
  }

}



