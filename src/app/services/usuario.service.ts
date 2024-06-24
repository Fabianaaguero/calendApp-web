import { Injectable } from '@angular/core';
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  Auth,
  browserSessionPersistence,
  inMemoryPersistence,
  setPersistence,
  onAuthStateChanged,
} from 'firebase/auth';

import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, setDoc } from "firebase/firestore";
import { UtilsService } from './utils.service';



@Injectable({
  providedIn: 'root',
})
export class UsuarioService {

  private svcAuth: Auth;
  public app: any;

  constructor(
    private utilsService: UtilsService
  ) {
    // Se inicializa Firebase
    this.app = initializeApp(environment.firebaseConfig);
    // Se inicializa Firebase Authentication y se obtiene una referencia al servicio
    this.svcAuth = getAuth();
    setPersistence(this.svcAuth, browserSessionPersistence);
  }


  getUsuarioActualApp(): string {
    const usr = sessionStorage.getItem('emailUserApp');
    if (usr != null){
      return usr
    }else{
      return ''
    }
  }

  getDatosUsuarioApp(){

  }

  //verifica que el usuario tiene una suscripcioon vigente para que pueda seguir usando la aplicacion
  async suscripcionVigente(usuario: string): Promise<String> {

    const db = getFirestore(this.app);
    const usuarioRef = collection(db, "usuarios");
    const q = query(usuarioRef, where("email", "==", usuario))
    const querySnapshot = await getDocs(q);

    const documento = querySnapshot.docs[0].id.toString()
    const docRef = doc(db, 'usuarios', documento);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const datos = docSnapshot.data();
      //obtener fecha de BBDD
      const fechaFin: string = datos['suscrip_vence'];
      const fechaActual: string = (new Date()).toISOString();
      //convertir a Date para luego comparar
      const fechaFinDate: Date = new Date(fechaFin);
      const fechaActualDate: Date = new Date(fechaActual);

      //aprovecho la conexión a la BBDD para obtener mas datos del usuario
      //cambiar esto a otro metodo/funcion
      sessionStorage.setItem('nombreUsuario', datos['nombre']);
      sessionStorage.setItem('apellidoUsuario',datos['apellido']);
      sessionStorage.setItem('finSuscripcion', fechaFin);
      sessionStorage.setItem('emailUserApp',usuario);
      sessionStorage.setItem('tipoSuscripcion', datos['tipo_suscripcion'])
      // ------------------------------------------------------------------

      //comparar fechas.
      if ((fechaFinDate) > (fechaActualDate)) {
        return 'SI';
      } else {
        return 'NO';
      }
      return fechaFin;
    } else {
      //console.log('doc no encontrado');
      return 'NO';
    }
  }

  async Suscribirse() {
    try {
      //se obtiene la fecha actual en formato ISO
      let fechaActual = new Date();
      fechaActual = this.utilsService.sumarDias(fechaActual, 730);
      const nueva_fecha_suscrip: string = fechaActual.toISOString();

      // modificar esto -------------------------
      const emailUsuario: string = this.getUsuarioActualApp();

      //conexion a la BBDD para actualizar suscripcion
      const db = getFirestore(this.app);
      const usuarioRef = collection(db, "usuarios");
      const q = query(usuarioRef, where("email", "==", emailUsuario));
      const querySnapshot = await getDocs(q);

      const documento = querySnapshot.docs[0].id.toString()
      const docRef = doc(db, 'usuarios', documento);
      const idDoc = docRef.id

      await updateDoc(doc(db, "usuarios", idDoc), {
        suscrip_vence: nueva_fecha_suscrip
      });

      ////console.log('Se actualizo la fecha de suscripción')      
      this.utilsService.mostrarAlerta('Aviso', 'Se ha completado la suscripción')
    } catch (error) {
      ////console.log('Error al guardar la fecha de suscripción: ', error);
      this.utilsService.mostrarAlerta('Advertencia', 'HUbo un problema y no se ha completado la suscripción')
    }
  }

}

