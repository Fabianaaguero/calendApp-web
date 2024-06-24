import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';
import { collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, setDoc, orderBy, limit, deleteDoc } from "firebase/firestore";
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss']
})
export class AgendaPage implements OnInit {

  fecha: any;
  mensajeTurno:string = '';
  turnoSeleccionadoID: string = '';
  turnoSeleccionado: any = null;
  currentValue: any;

  turnosDia: {
    nombre: string;
    pacienteID: string;
    fecha: string;
    hora: string
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private router:Router,
    private utilSVC: UtilsService,
    private userSVC: UsuarioService
  ) {}

  ngOnInit() {
    this.fecha = this.route.snapshot.paramMap.get('fecha');
  }

  ionViewDidEnter(){
    console.log('Agenda-IonView')
    this.ListarTurnos(this.fecha);
  }


  seleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.turnoSeleccionadoID = turno.id;
  }

  private async ListarTurnos(dia: any) {
    this.mensajeTurno = 'No hay turnos para este día'

    try {
      const usuarioActual = this.userSVC.getUsuarioActualApp();
      const db = getFirestore();
      const turnosRef = collection(db, 'turnos');
      const q = query(turnosRef, where('usuarioID', '==', usuarioActual), where('fecha', '==', dia));

      this.turnosDia = [];
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
          this.turnosDia.push(turno);
          this.mensajeTurno = ''
        });

        //ordena los turnos segun la hora
        this.turnosDia.sort((a, b) => {
          if (a.hora < b.hora) return -1;
          if (a.hora > b.hora) return 1;
          return 0;
        });
      } 
    } catch (error) {
      console.log('Error listando turnos. Error: ' + error);
    }
  }

  eliminarTurno() {
    if (this.turnoSeleccionadoID !== '') {
      const index = this.turnosDia.findIndex(
        (paciente) => paciente === this.turnoSeleccionado
      );
      if (index !== -1) {
        this.turnosDia.splice(index, 1);
        this.eliminarTurnoFirestore(this.turnoSeleccionado);
        this.turnoSeleccionado = null;
        this.turnoSeleccionadoID = '';
      }
    } else {
      this.utilSVC.mostrarAlerta('Atención', 'Por favor, selecciona el turno que quieras eliminar.');
    }
  }

  private async eliminarTurnoFirestore(turno: any) {
    if (turno.id !== '') {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'turnos', turno.id);
        await deleteDoc(docRef);
        //console.log('Turno eliminado de Firestore');
      } catch (error) {
        //console.log('Error al eliminar turno en Firestore', error);
      }
    }
  }

  public agregarTurno(){
    this.router.navigate(['/createturno/' + this.fecha]);
  }


  handleRefresh(event:any) {
    setTimeout(() => {
      this.ListarTurnos(this.fecha)
      event.target.complete();
    }, 2000);
  }

}
