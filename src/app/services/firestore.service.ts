import { Injectable, OnInit } from '@angular/core';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, setDoc, orderBy, limit } from "firebase/firestore";
import { AuthenticationService } from './authentication.service';
import { UsuarioService } from './usuario.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit {
  private app: any;
  private usuarioActual: string = '';
  private turnosHoy: {
    nombre: string;
    pacienteID: string;
    fecha: string;
    hora: string
  }[] = [];


  constructor(
    private userSVC: UsuarioService,
    private authSVC: AuthenticationService,
    private utilSVC: UtilsService
  ) {
    //inicializo app
    this.app = authSVC.app;
    //obtengo el usuario actualmente logeado en la aplicacion
    this.usuarioActual = userSVC.getUsuarioActualApp();

    //obtener fecha actual
    //let fechaHoy: string = new Date().toLocaleString('es-AR', { hour12: false });
    //fechaHoy = this.utilsService.getFecha(fechaHoy);

    //this.ListarTurnosHoy(fechaHoy);
  }

  ngOnInit(): void { }

  public getTurnos(fecha:string):any{
    //await this.ListarTurnosHoy(fecha);
    console.log ('TurnosHoy: ' + this.turnosHoy);
    return this.turnosHoy;
  }

  //lista los turnos que el usuario de la app tiene para el dia de hoy
  private async ListarTurnosHoy(fecha: string) {
    try {
      const db = getFirestore(this.app);
      const turnosRef = collection(db, 'turnos');
      const q = query(turnosRef, where('usuarioID', '==', this.usuarioActual), where('fecha', '==', fecha));

      this.turnosHoy = [];
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const datos = doc.data();
          const id = doc.id;
          const turno = {
            id: id,
            nombre: datos['nom_paciente'],
            pacienteID: datos['pacienteID'],
            fecha: datos['fecha'],
            hora: datos['hora']
          };
          console.log(datos);
          console.log(turno);
          this.turnosHoy.push(turno);
        });
        //ordena los turnos segun la hora
        this.turnosHoy.sort((a, b) => {
          if (a.hora < b.hora) return -1;
          if (a.hora > b.hora) return 1;
          return 0;
        });
        console.log(this.turnosHoy)
        console.log('Turnos listados');
      }

    } catch (error) {
      console.log('Error listando turnos. Error: ' + error);
    }
  }

}


function getTurnos(fechaHoy: any, string: any): any {
  throw new Error('Function not implemented.');
}

