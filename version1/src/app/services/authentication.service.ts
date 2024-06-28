import { Injectable } from '@angular/core';
import {getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
  signOut, createUserWithEmailAndPassword, Auth, browserSessionPersistence, inMemoryPersistence, setPersistence,
  sendPasswordResetEmail} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private auth: Auth;
  public app: any;

  constructor() {
    this.app = initializeApp(environment.firebaseConfig);
    this.auth = getAuth(this.app);
    setPersistence(this.auth, browserSessionPersistence);
  }

  /**
   * Para la autenticacion de usuario se utilizan los metodos que proporciona Firebase.
   * referencia: https://firebase.google.com/docs/auth/?hl=es&authuser=0
   */

  /**
   * Login usando cuenta de correo y contraseña.
   * @param email 
   * @param password 
   * @returns true (usuario válido) o false (usuario no válido)
   */
  async SignInWithEmail(email: any, password: any): Promise<boolean> {
    try {
      let userAuth = await signInWithEmailAndPassword(this.auth, email, password)
      if (userAuth !== null && userAuth.user !== null && userAuth.user.email !== null) {
        return true; 
      } else {
        return false; 
      }
    } catch (error: any) {
      return false;
    }
  }

  async ResetPassword(email: any): Promise<boolean> {    
    try {
      let res = await sendPasswordResetEmail(this.auth, email);
      if (res !== null){
      //console.log('Correo de recuperación de contraseña enviado exitosamente.');
      return true;
      }else{
        //console.error('Error al enviar el correo de recuperación:', error.message);
        return false;
      }
    } catch (error:any) {
      //console.error('Error al enviar el correo de recuperación:', error.message);
      return false;
    }
  }

  /**
   * se crea un usuario y se agrega en firebase
   * si el usuario ya existe, no se creará nuevamente, se mostrará un mensaje indicando tal situación.
   * @param email :string
   * @param password :string
   * @returns un string que indica si elusuario fue creado, si existía previamente o si hubo un error en el proceso.
   */
  async CreateUserWithMail(email: string, password: string): Promise<String> {
    try {
      let res: any = await createUserWithEmailAndPassword(this.auth, email, password);
      return "creado"; //se creó correctamente el nuevo usuario.

    } catch (error: any) {
      let resError: string = new String(error).valueOf();
      if (resError.indexOf("email-already-in-use") != 0) {
        return "existe"; //no se creó el usuario porque ya existe.
      } else {
        return "error"; //no se creó el usuario, hubo un error.
      }
    }
  }


  /**
   * Se cierra sesion de usuario
   */
  async Logout() {
    sessionStorage.setItem('userAppLogged', 'false');
    sessionStorage.setItem('emailUserApp', "");
    sessionStorage.setItem('nombreUsuario', "");
    sessionStorage.setItem('apellidoUsuario',"");
    await signOut(this.auth);
  }

}
