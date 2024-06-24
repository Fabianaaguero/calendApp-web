import { Component, OnInit } from '@angular/core';
import { collection, query, where, getDocs, getFirestore, deleteDoc, doc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { PatientInfoPage } from '../patients/patient-info.page';
import { UsuarioService } from '../services/usuario.service';
import { UtilsService } from '../services/utils.service';


@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  constructor(
    private router: Router,
    private modalController: ModalController,
    private userSVC: UsuarioService,
    private utilSVC: UtilsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.ListarClientes();
  }

  pacienteSeleccionadoId: string = '';
  pacientes: {
    nombre: string;
    apellido: string;
    correo: string;
    dni: string;
    telefono: string;
    fechaNac: string;
  }[] = [];
  searchTerm: string = '';
  pacienteSeleccionado: any = null;


  accederAnotador() {
    if (this.pacienteSeleccionadoId !== '') {
      this.router.navigate(['/annotator/' + this.pacienteSeleccionado.id]);
    } else {
      this.utilSVC.mostrarAlerta('Atención', 'Por favor, selecciona un cliente para acceder al anotador');
    }
  }


  seleccionarPaciente(paciente: any) {
    this.pacienteSeleccionado = paciente;
    this.pacienteSeleccionadoId = paciente.id;
  }


  private async ListarClientes() {
    try {
      const usuarioID = this.userSVC.getUsuarioActualApp(); //obtengo el usuario logeado en la app
      const db = getFirestore();
      const pacientesRef = collection(db, 'pacientes');
      const q = query(pacientesRef, where('usuarioID', '==', usuarioID));

      this.pacientes = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const datos = doc.data();
        const id = doc.id;
        const paciente = {
          id: id,
          nombre: datos['nombre'],
          apellido: datos['apellido'],
          correo: datos['correo'],
          dni: datos['dni'],
          telefono: datos['telefono'],
          fechaNac: datos['fechaNac'],
        };
        this.pacientes.push(paciente);
      });

      this.pacientes.sort((a, b) => {
        if (a.apellido < b.apellido) return -1;
        if (a.apellido > b.apellido) return 1;
        return 0;
      });
      //console.log(this.pacientes);
    } catch (error) {
      //console.log((error);
    }
  }


  eliminarPaciente() {
    if (this.pacienteSeleccionadoId !== '') {
      const index = this.pacientes.findIndex(
        (paciente) => paciente === this.pacienteSeleccionado
      );
      if (index !== -1) {
        this.pacientes.splice(index, 1);
        this.eliminarTurnosPersona(this.pacienteSeleccionado);
        this.eliminarPacienteFirestore(this.pacienteSeleccionado);
        this.pacienteSeleccionado = null;
        this.pacienteSeleccionadoId = '';
      }
    } else {
      this.utilSVC.mostrarAlerta('Atención', 'Por favor, selecciona el cliente que quieras eliminar.');
    }
  }


  async eliminarPacienteFirestore(paciente: any) {
    if (paciente.id !== '') {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'pacientes', paciente.id);
        await deleteDoc(docRef);
        //console.log('Persona eliminada de Firestore');
      } catch (error) {
        //console.log('Error al eliminar persona de Firestore', error);
        this.utilSVC.mostrarAlerta("Atención", "Se produjo un error el eliminar el cliente")
      }
    }
  }

  async eliminarTurnosPersona(persona: any) {
    if (persona.id !== '') {
      try {
        const db = getFirestore();
        const turnosRef = collection(db, 'turnos');
        const q = query(turnosRef, where('pacienteID', '==', persona.id));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 0) {
          querySnapshot.forEach((doc) => {
            this.eliminarTurno(doc.id);
          });
        };
      } catch (error) {
        this.utilSVC.mostrarAlerta("Atención", "Se produjo un error el eliminar los turnos del cliente")
      }
    }
  }

  async eliminarTurno(turno_id: any) {
    const db = getFirestore();
    await deleteDoc(doc(db, "turnos",turno_id));
  }


  async mostrarInformacionPaciente() {
    if (this.pacienteSeleccionadoId !== '') {
      const modal = await this.modalController.create({
        component: PatientInfoPage,
        componentProps: {
          paciente: this.pacienteSeleccionado,
        },
      });
      return await modal.present();
    } else {
      this.utilSVC.mostrarAlerta('Atención', 'Por favor, selecciona el cliente del que quieras mostrar información.');
    }
  }


  asignarTurnoPaciente() {
    if (this.pacienteSeleccionadoId !== '' && this.pacienteSeleccionado !== 0) {
      this.router.navigate(['/assignturn2/' + this.pacienteSeleccionado.id]);
    } else {
      this.utilSVC.mostrarAlerta('Atención', 'Por favor, selecciona el cliente al que quieres asignarle un turno.');
    }
  }


}

