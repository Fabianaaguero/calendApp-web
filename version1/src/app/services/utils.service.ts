import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  /**
 * Se muestra un mensaje usando un Alert de Ionic.
 * Se pasan como parámetros, el título que tendra el mensaje de alerta
 * y el mensaje a mostrarse.
 * @param titulo - string
 * @param mensaje - string
 */
  async mostrarAlerta(cabecera: string, mensaje: string) {
    let alertController: AlertController = new AlertController();
    const alert = await alertController.create({
      header: cabecera,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  //Función que suma o resta días a una fecha, si el parámetro días es negativo restará los días
  sumarDias(fecha: Date, dias: number): Date {
    fecha.setDate(fecha.getDate() + dias);
    return fecha
  }

  // devuleve un string de fecha en formato 'DD-MM-YYYY' 
  // a partir de un string con formato de fecha LocaleString (4/5/2024, 16:38:40)
  getFechaFromLocaleString(fechaHora:string):string{
    try {
      const fh = fechaHora.split(',');
      const fecha = fh[0].trim(); //aqui esta la fecha
      const hora = fh[1].trim(); // aqui esta la hora
  
      const f = fecha.split('/');
      let dia = f[0];
      let mes = f[1];
      const año = f[2];
  
      if(dia.length === 1){
        dia = '0' + dia;
      }
  
      if (mes.length === 1){
        mes = '0' + mes;
      }
      return dia + '-' + mes + '-' + año;

    } catch (error) {
      //console.log('Se produjo un error. Error: ' + error)
      return ''
    }

  }

  // devuleve un string de hora en formato 'HH:MM' 
  // a partir de un string con formato de fecha LocaleString (4/5/2024, 16:38:40)
  getHoraFromLocaleString(fechaHora:string):string{
    try {
      const fh =fechaHora.split(',');
      const fecha = fh[0].trim(); // aqui esta la fecha
      const hora = fh[1].trim(); // aqui esta la hora: HH:MM:SS
  
      const h = hora.substring(0,5); //se eliminan los segundos
      return h;
    } catch (error) {
      //console.log('Se produjo un error. Error: ' + error)
      return ''
    }
  }
  
  
  // devuleve un string de hora en formato 'HH:MM' 
  // a partir de un string con formato de fecha ISO (2024-05-04T15:24:00)
  getHoraFromISO(horaISOString:string):string{
    try {
      const hora:string = horaISOString.substring(11,16);
      return hora;
    } catch (error) {
      //console.log('Se produjo un error. Error: ' + error)
      return ''
    }
  }

  // devuleve un string de fecha en formato 'DD-MM-YYYY' 
  // a partir de un string con formato de fecha ISO (2024-05-04T15:24:00)
  getFechaFromISO(fechaISOString:string):string{
    try {
      let fechaEnPartes = fechaISOString.split('-');
      let año = (fechaEnPartes[0]).toString();
      let mes = (fechaEnPartes[1]).toString();
      let dia = (fechaEnPartes[2]).toString();
      dia = dia.substring(0,2);    
      return dia + '-' + mes + '-' + año;  
    } catch (error) {
      //console.log('Se produjo un error. Error: ' + error)
      return ''
    }  
  }

  public generaCadenaAleatoria(n: number): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < n; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
}

