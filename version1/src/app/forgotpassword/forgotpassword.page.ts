import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.page.html',
  styleUrls: ['./forgotpassword.page.scss'],
})
export class ForgotpasswordPage implements OnInit {

  constructor(
    private authSVC: AuthenticationService,
    private utilsSVC: UtilsService
  ) { }

  ngOnInit() { }

  recuperarCuenta(email: any){
    email = email = email.value.toString().toLowerCase().trim();
    if (this.isValidEmail(email)){
      this.resetPassword(email);
    }
  }

  //verificar que la direccion de email tiene el formato correcto
  private isValidEmail(email: string): boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email);
    return result;
  }

  //se intenta el envio de un email para resetear la contraseña
  private async resetPassword(email: string) {
    try {
      let res: boolean = await this.authSVC.ResetPassword(email)
      if (res === true) {
        console.log('Se ha enviado un email para recuperar el acceso a CalendApp');
        this.utilsSVC.mostrarAlerta("Aviso", "Se ha enviado un email que te permitirá recuperar el acceso a CalendApp");
      }
    } catch (error: any) {
      console.log('Error al recuperar la cuenta de usuario');
      this.utilsSVC.mostrarAlerta("Alerta", "Hubo un problema al tratar de restaurar tu acceso a CalendApp");
    }
  }
}
