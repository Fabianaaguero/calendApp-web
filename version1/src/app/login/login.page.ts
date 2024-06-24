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
  ) {}

  ngOnInit() { 
    //cada vez que se ingresa a la pagina se ejecuta esto para detectar si se presiona Enter
    const box = document.querySelector(".contenedor");
    document.addEventListener("keyup", e =>{
      this.teclaEnterPresionada(e.key);     
    });  
  }

  ionViewDidEnter() {
    this.CleanData();
  }

  ionViewDidLeave() {
    this.CleanData();
  }

  //permite ingresar presionando la tecla Enter (tienen que estar los datos de emil y contraseña)
  private teclaEnterPresionada(key:any){
    let inputEmail=document.getElementById('idEmail') as HTMLInputElement | null;
    let inputPassw=document.getElementById('idPassw') as HTMLInputElement | null;
    //si se presionó Enter, se verifica que elementos no sean nulos y tengan al menos un valor
    if (key === 'Enter'){
      if (inputEmail != null && inputPassw != null && inputEmail.value.trim() !== "" && inputPassw.value.trim() !== ""){
        this.LogInWithEmail(inputEmail,inputPassw);
      }
    }
  }

  //login usando email y contraseña. Se usa método provisto por Google
  async LogInWithEmail(email: any, password: any) {
    email = email.value.toLowerCase().trim();
    password = password.value.toString().toLowerCase().trim();

    try {
      let res: boolean = await this.authService.SignInWithEmail(email, password);
      if (res === true) {
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

  //se limpian los input: email y contraseña
  CleanData() {
    let email = document.getElementById("idEmail") as HTMLInputElement | null;
    if (email != null) {
      email.value = "";
    }
    let passw = document.getElementById("idPassw") as HTMLInputElement | null;
    if (passw != null) {
      passw.value = "";
    }
  }

  //redirige a la pagina de registro
  Registrarse() {
    this.router.navigate(['/register']);
  }

  //redirige a la pagina de recuperar contraseña
  recuperarContrasena() {
    this.router.navigate([('/forgotpassword')]);
  }
}
