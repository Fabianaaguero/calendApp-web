import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { UtilsService } from '../services/utils.service';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, setDoc, orderBy, limit } from "firebase/firestore";
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  private app: any;
  mensajeTurno:string = '';

  turnosHoy: {
    nombre: string;
    pacienteID: string;
    fecha: string;
    hora: string
  }[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private utilSVC: UtilsService,
    private userSVC:UsuarioService
  ) { }

  ngOnInit() {}

  ionViewWillEnter(){
    this.ListarTurnosHoy();
  }

  private async ListarTurnosHoy() {
    this.mensajeTurno = 'No hay turnos para hoy'

    try {
      let fechaHoy: string = new Date().toLocaleString('es-AR', { hour12: false });
      fechaHoy = this.utilSVC.getFechaFromLocaleString(fechaHoy);
      const usuarioActual = this.userSVC.getUsuarioActualApp();

      const db = getFirestore(this.app);
      const turnosRef = collection(db, 'turnos');
      const q = query(turnosRef, where('usuarioID', '==', usuarioActual), where('fecha', '==', fechaHoy));

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
          this.turnosHoy.push(turno);
          this.mensajeTurno = ''
        });

        //ordena los turnos segun la hora
        this.turnosHoy.sort((a, b) => {
          if (a.hora < b.hora) return -1;
          if (a.hora > b.hora) return 1;
          return 0;
        });
      }

    } catch (error) {
      console.log('Error listando turnos. Error: ' + error);
    }
  }

  verAgendaTurnos() {
    let fechaHoy: string = new Date().toLocaleString('es-AR', { hour12: false });
    fechaHoy = this.utilSVC.getFechaFromLocaleString(fechaHoy);
    this.router.navigate(['/agenda/' + fechaHoy]);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
    this.authenticationService.Logout();
  }

  handleRefresh(event:any) {
    setTimeout(() => {
      this.ListarTurnosHoy();
      event.target.complete();
    }, 2000);
  }

}

