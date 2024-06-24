import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Firestore, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where, setDoc, addDoc } from "firebase/firestore";
import { UsuarioService } from '../services/usuario.service';
import { UtilsService } from '../services/utils.service';
import { MessageService } from '../services/mensaje.service';
import { EstructurasDatos } from '../interfaces/estructuras-datos';

@Component({
  selector: 'app-assignturn2',
  templateUrl: './assignturn2.page.html',
  styleUrls: ['./assignturn2.page.scss'],
})
export class Assignturn2Page implements OnInit {

  private pacienteId: any;
  private nombreCliente: string = '';
  private apellidoCliente: string = '';
  private emailCliente: string = '';
  private emailData:EstructurasDatos["email_Data"]

  minDate:any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private utilsService: UtilsService,
    private mensajeSVC: MessageService
  ) { 
    this.emailData = {
      remitente: "",
      emailFrom: "",
      asunto: "",
      mensaje: "",
      emailTo:"",
      prioridad:"",
      replyTo: "",
    }
    this.minDate = new Date().toISOString();
   }

  ngOnInit() {
    this.pacienteId = this.route.snapshot.paramMap.get('pacienteId');
    this.getDatosCliente(this.pacienteId);
  }

  Cancelar() {
    this.router.navigate(['/patients']);
  }


  async asignarTurno(fechahora: any) {
    try {
      //fecha seleccionada en el calendario
      let fechaSeleccion: string = fechahora.value.toString();
      //fecha y hora que se agregarán a la bbdd
      const fecha: string = this.utilsService.getFechaFromISO(fechaSeleccion);
      const hora: string = this.utilsService.getHoraFromISO(fechaSeleccion);

      const IDusuario = this.usuarioService.getUsuarioActualApp();
      const IDpaciente = this.pacienteId;
      if (IDpaciente != '' && IDusuario !== '') {
        const app = initializeApp(environment.firebaseConfig);
        const db = getFirestore(app);
        const docu_name: string = this.utilsService.generaCadenaAleatoria(20);

        // agrega un nuevo documento a la coleccion turnos
        await setDoc(doc(db, "turnos", docu_name), {
          fecha: fecha,
          hora: hora,
          nom_paciente: this.nombreCliente + ' ' + this.apellidoCliente,
          pacienteID: IDpaciente,
          usuarioID: IDusuario
        });

        //--------------------------------------------------------------------------
        // se envía una notificacion al cliente
        if ((environment.emailSettings.sendEmail) === true) {
          this.emailData = {
            remitente: sessionStorage.getItem('nombreUsuario') + " " + sessionStorage.getItem('apellidoUsuario'),
            emailFrom: environment.emailSettings.emailAccount,
            asunto: "Notificación de asignación de turno",
            mensaje: "Hola " + this.nombreCliente + ' ' + this.apellidoCliente + "\n" + 
            sessionStorage.getItem('nombreUsuario') + " " + 
            sessionStorage.getItem('apellidoUsuario') + 
            " te ha asignado un turno el día " + fecha + " a las " + hora + " horas." + 
            "\n\nTe esperamos.",
            emailTo: this.emailCliente,
            prioridad: "high",
            replyTo: this.usuarioService.getUsuarioActualApp().toString(),
          }
          this.mensajeSVC.sendMessage(this.emailData).subscribe(() => {
           //console.log("Email enviado al cliente");
          });
        }
        //--------------------------------------------------------------------------       

        //console.log('Se agregó un turno a la BBDD');
        this.utilsService.mostrarAlerta('Aviso', 'Se ha agendado un nuevo turno.');
        this.router.navigate(['/patients']);

      } else {
        this.utilsService.mostrarAlerta('Atención', 'No se pudo agregar el turno porque faltaba información importante.');
      }
    } catch (error: any) {
      //console.log('Se generó un problema al agregar un turno. Error:' + error);
      this.utilsService.mostrarAlerta('Atención', 'Se generó un problema al agregar el turno.');
    }
  }

  async getDatosCliente(IDpaciente: string): Promise<string> {
    const app = initializeApp(environment.firebaseConfig);
    const db = getFirestore(app);
    const docRef = doc(db, "pacientes", IDpaciente);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      this.nombreCliente = docSnap.data()["nombre"];
      this.apellidoCliente = docSnap.data()["apellido"];
      this.emailCliente = docSnap.data()["correo"];
    } else {
      //console.log("No se encontro nombre/apellido/email del cliente");
    }
    return '';
  }
}
