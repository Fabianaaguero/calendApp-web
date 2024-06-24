import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UtilsService } from 'src/app/services/utils.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class loginPage implements OnInit {

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private utilsService: UtilsService,
    private usuarioService: UsuarioService,
  ) { 
    this.CleanData();
  }

  ngOnInit() {
    this.CleanData();
  }

  async LogInWithEmail(email:any, password: any) {
    email = email.value.toLowerCase().trim();
    password = password.value.toString().toLowerCase().trim();

    try {
      let res: boolean = await this.authService.SignInWithEmail(email, password);
      if (res === true) {
        this.CleanData();

        //verificar que el usuario tiene una suscripcion vigente
        const suscripVigente: string = (await this.usuarioService.suscripcionVigente(email)).toString();
        if (suscripVigente === 'NO') {
          this.utilsService.mostrarAlerta('Advertencia', 'No tiene una suscripción vigente. Para seguir usando la aplicacion debe renovar su suscripción')
          //el usaurio no tiene una suscripcion vigente. dirigir al usuario a la pagina de suscripcion
          this.router.navigate(['/suscription']);

        } else {
          //todo esta bien, dirigir al usuario a la pagina HOME
          sessionStorage.setItem('userAppLogged', 'true');
          sessionStorage.setItem('emailUserApp', email);
          this.router.navigate(['/home']);
        }

      } else {
        //usuario no valido
        sessionStorage.setItem('userAppLogged', 'false')
        sessionStorage.setItem('emailUserApp', '');
        this.utilsService.mostrarAlerta('Atención', 'Usuario y/o contraseña incorrectos');
      }
    } catch (error: any) {
      // error en el proceso de autenticacion
      sessionStorage.setItem('userAppLogged', 'false')
      sessionStorage.setItem('emailUserApp', '');
      this.router.navigate(['/error']);
    }
  }

  CleanData() {
    let email = document.getElementById("idEmail");
    if (email != null) {
      email.innerText = "";
      email.innerHTML = "";
    }

    let passw = document.getElementById("idPassw");
    if (passw != null) {
      passw.innerText = "";
      passw.innerHTML = "";
    }
  }

  Registrarse(){
    this.router.navigate(['/register']);
  }

  recuperarContrasena(){
    this.router.navigate([('/forgotpassword')]);
  }

  onKeyDown(event: KeyboardEvent, email: any, password: any) {
    if (event.key === 'Enter') {
        //console.log("Tecla Enter presionada");
        this.LogInWithEmail(email, password);
    }
  }

}
