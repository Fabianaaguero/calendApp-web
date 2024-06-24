import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    private router: Router,
    private authSVC: AuthenticationService
  ) {
    this.usuarioEstaActivo();
  }

  //revisa el tiempo que el usuario no realiza ningun movimiento con el mouse o el teclado
  //para determinar si se lo considera inactivo y se cierra la sesión
  usuarioEstaActivo() {
    let tiempo:number=600000; //tiempo en milisegundos
    let timeout: any;

    window.onpageshow = function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        let auth2: AuthenticationService = new AuthenticationService;
        auth2.Logout();
        window.location.href = "/";
      }, tiempo);
    }

    window.document.onclick = function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        let auth2: AuthenticationService = new AuthenticationService;
        auth2.Logout();
        window.location.href = "/";
      }, tiempo);
    }

    window.document.onmousemove = function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        let auth2: AuthenticationService = new AuthenticationService;
        auth2.Logout();
        window.location.href = "/";
      }, tiempo);
    }

    window.document.onkeydown = function () {
      clearTimeout(timeout);
      timeout = setTimeout(function () {
        let auth2: AuthenticationService = new AuthenticationService;
        auth2.Logout();
        window.location.href = "/";
      }, tiempo);
    }
  }


}
