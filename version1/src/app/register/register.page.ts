import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, getFirestore, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class registerPage implements OnInit {

  suscribir_anual: boolean = false;
  defaultSelectedRadio = "prueba";
  selectedRadioGroup: any;
  selectedRadioItem: any;


  constructor(
    private authService: AuthenticationService,
    private firestore: Firestore,
    private router: Router,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.CleanData();
  }

  CreateUser(email: any, password: any, password2: any, nombre: any, apellido: any, tarjeta_numero: any, tarjeta_vence: any, codigo_seguridad:any) {
    try {
      email = email.value.toString().trim().toLowerCase().trim();
      password = password.value.toString().trim();
      password2 = password2.value.toString().trim();
      nombre = nombre.value.toString().trim();
      apellido = apellido.value.toString().trim();
  
      if (tarjeta_numero === null || tarjeta_numero === undefined || tarjeta_numero === ""){
        tarjeta_numero = ""
      }else {
        tarjeta_numero = tarjeta_numero.value.toString().trim();
      }
  
      if (tarjeta_vence === null || tarjeta_vence === undefined || tarjeta_vence === ""){
        tarjeta_vence = ""
      }else {
        tarjeta_vence = tarjeta_vence.value.toString().trim();
      }
  
      if (codigo_seguridad === null || codigo_seguridad === undefined || codigo_seguridad === ""){
        codigo_seguridad = ""
      }else {
        codigo_seguridad = codigo_seguridad.value.toString().trim();
      }
  
      if (this.isDataOK(email, password, password2, nombre, apellido, tarjeta_numero, tarjeta_vence, codigo_seguridad)) {
        this.CreateNewUser(email, password, nombre, apellido);
      }
    } catch (error) {
      this.router.navigate(['/error']);
    }
  }  
  

  isDataOK(mail: string, passw: string, passw2: string, nombre: string, apellido: string,
    tarjeta_numero: string, tarjeta_vence: string, codigo_seguridad: string): boolean {
    if (
      this.isTextEmpty(mail,passw,passw2,nombre,apellido)
    ) {
      //this.mostrarAlerta("Error", "No puede dejar datos en blanco");
      this.utilsService.mostrarAlerta(
        'Error',
        'No puede dejar datos en blanco'
      );
      return false;
    }

    //se verifica que la dirección de email tenga un formato correcto
    if (this.isValidEmail(mail) !== true) {
      this.utilsService.mostrarAlerta(
        'Error',
        'La dirección de email no tiene un formato válido'
      );
      return false;
    }

    //se verifica que las contraseñas sean iguales
    if (this.isSamePassword(passw, passw2) !== true) {
      this.utilsService.mostrarAlerta(
        'Error',
        'Las contraseñas no coinciden'
      );
      return false;
    }

    //se comprueba el largo de la contraseña
    if (this.isLenghtOK(passw) !== true) {
      this.utilsService.mostrarAlerta(
        'Alerta',
        'La contraseña debe tener entre 8 y 16 caracteres'
      );
      return false;
    }

    //si esta seleccionada la suscripcion anual, verificar que se ingresaron los datos de la tarjeta
    if (this.suscribir_anual === true) {
      if (tarjeta_numero.length !== 16) {
        this.utilsService.mostrarAlerta(
          'Advertencia',
          'El número de tarjeta ingresado es incorrecto'
        );
        return false;
      }

      if (tarjeta_vence.length !== 6) {
        this.utilsService.mostrarAlerta(
          'Advertencia',
          'La fecha ingresada es incorrecta'
        );
        return false;
      }

      if (codigo_seguridad.length !== 3) {
        this.utilsService.mostrarAlerta(
          'Advertencia',
          'El código de seguridad ingresado es incorrecto'
        );
        return false;
      }
    }
    // todo bien
    return true;
  }

  isTextEmpty(email: string, passw: string, passw2: string, nombre: string, apellido: string): boolean {
    if (email === "" || passw === "" || passw2 === "" || nombre === "" || apellido === "") {
      return true;
    } else {
      return false;
    }
  }

  isLenghtOK(passw: string): boolean {
    if (passw.length < 8 || passw.length > 16) {
      return false;
    } else {
      return true;
    }
  }

  isSamePassword(passw: string, passw2: string): boolean {
    if (passw === passw2) {
      return true;
    } else {
      return false;
    }
  }

  isValidEmail(email: string): boolean {
    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    const result: boolean = expression.test(email);
    return result;
  }

  async CreateNewUser(email: string, password: string, nombre: string, apellido: string) {
    try {
      let newUser: any = await this.authService.CreateUserWithMail(email, password)

      switch (newUser) {
        case ("creado"):
          sessionStorage.setItem('userAppLogged', 'true');
          this.utilsService.mostrarAlerta('Aviso', 'Se ha registrado exitosamente como usuario de CalendApp.');

          //para agregar usuario a Firestore
          //si se suscribió, es por 365 dias, sino solo serán 30 dias de uso.
          //console.log("agregando usuario a Firestore")
          if (this.suscribir_anual === false) {
            this.AgregarUsuarioEnBBDD(nombre, apellido, email, 30)
          } else {
            this.AgregarUsuarioEnBBDD(nombre, apellido, email, 365)
          }

          this.router.navigate(['/login']);
          break;

        case ("existe"):
          sessionStorage.setItem('userAppLogged', 'false');
          this.utilsService.mostrarAlerta('Advertencia', 'El correo electrónico ya está en uso.');
          break;

        default:
          sessionStorage.setItem('userAppLogged', 'false');
          this.utilsService.mostrarAlerta('Atención', 'No se ha podido crear el usuario. Por favor, inténtelo nuevamente.');
          break;
      }
    } catch (error) {
      sessionStorage.setItem('userAppLogged', 'false');
      this.router.navigate(['/error']);
    }
  }

  //agrega un usuario a la base de datos de la aplicación.
  //la dirección de email es con la que se registra tambien en firebase para autenticación
  //importante: fecha de vencimiento de la suscripcion. Esta fecha determina si el usuario puede seguir usando la aplicacion
  AgregarUsuarioEnBBDD(nombre: string, apellido: string, email: string, dias: number) {

    const objetoUsuario: any = {
      nombre: nombre,
      apellido: apellido,
      email: email,
      fecha_registro: (new Date()).toISOString(),
      suscrip_vence: (this.utilsService.sumarDias(new Date(), dias)).toISOString()
    };

    //se agrega la informacion del usuario a la base de datos Firestore. Con esto se crea el usuario.
    const collectionUsuario = collection(this.firestore, 'usuarios');
    addDoc(collectionUsuario, objetoUsuario)
      .then(() => {
        //console.log('Se ha agregado el usuario a Firestore');
        // TODO -----------------
      })
      .catch((err) => {
        console.error('Error al agregar el usuario a Firestore. Error: ', err);
        // TODO ----------------
      });
  }


  CleanData() {
    let email = document.getElementById("idEmail");
    if (email != null) {
      email.innerText = "";
    }

    let passw = document.getElementById("idPassw");
    if (passw != null) {
      passw.innerText = "";
    }

    let passw2 = document.getElementById("idPassw2");
    if (passw2 != null) {
      passw2.innerText = "";
    }
  }

  radioGroupChange(event: any) {
    this.selectedRadioGroup = event.detail;

    if (event.detail.value === 'suscribir') {
      this.suscribir_anual = true;
    } else {
      this.suscribir_anual = false;
    }
  }

  radioSelect(event: any) {
    this.selectedRadioItem = event.detail;
  }

  gotoLogin() {
    this.router.navigate(['logon']);
  }

}
