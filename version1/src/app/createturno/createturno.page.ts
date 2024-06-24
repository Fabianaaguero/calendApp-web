import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { UtilsService } from '../services/utils.service';
import { getDocs, collection, query, where, getFirestore, doc, setDoc } from 'firebase/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { MessageService } from '../services/mensaje.service';
import { EstructurasDatos } from '../interfaces/estructuras-datos';

@Component({
  selector: 'app-createturno',
  templateUrl: './createturno.page.html',
  styleUrls: ['./createturno.page.css'],
})
export class CreateturnoPage implements OnInit {

  //minDate:any //se usa para ajustar la fecha mas atras que permite el calendario.

  personas: {
    id:string;
    nombre: string;
    apellido: string;
    correo: string;
    dni: string;
    telefono: string;
    fechaNac: string;
  }[] = [];

  private persona:any;
  private fechaActual:any;
  private horaActual:any;
  public fechaSel:any;  //fecha selecionada por el usuario, pasada en la URL
  private horaSel:any;  //hora seleccionada por el usuario en este formulario
  private emailData:EstructurasDatos["email_Data"]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userSVC:UsuarioService,
    private utilsSVC:UtilsService,
    private mensajeSVC: MessageService,
  ) { 
    this.fechaActual = new Date().toLocaleDateString();
    this.horaActual = new Date().toLocaleTimeString();          
    this.emailData = {
      remitente: "",
      emailFrom: "",
      asunto: "",
      mensaje: "",
      emailTo:"",
      prioridad:"",
      replyTo: "",
    }
  }

  ngOnInit() {
    this.fechaSel = this.route.snapshot.paramMap.get('fecha');
    this.listarPacientes()
  }


  async listarPacientes() {
    try {
      const usuarioID = this.userSVC.getUsuarioActualApp();
      const db = getFirestore();
      const pacientesRef = collection(db, 'pacientes');
      const q = query(pacientesRef, where('usuarioID', '==', usuarioID) );

      this.personas = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const datos = doc.data();
        const id = doc.id;
        const persona = {
          id: id,
          nombre: datos['nombre'],
          apellido: datos['apellido'],
          correo: datos['correo'],
          dni: datos['dni'],
          telefono: datos['telefono'],
          fechaNac: datos['fechaNac'],
        };
        //console.log('Persona: ' + persona);
        this.personas.push(persona);        
      });

      this.personas.sort((a, b) => {
        if (a.apellido < b.apellido) return -1;
        if (a.apellido > b.apellido) return 1;
        return 0;
      });
      //console.log(this.personas);
    } catch (error) {
      //console.log((error);
    }
  }

  guardarTurno(){
    let hayError:Boolean = false;

    let usuario_App:string = this.userSVC.getUsuarioActualApp(); //email del usuario logeado
    let dia:string = this.fechaSel;
    let hora:string = this.horaSel;
    let id_persona:string = this.persona.id;
    let name:string=this.persona.nombre;
    let apel:string=this.persona.apellido;

    //validacion de datos
    if (usuario_App === '' || usuario_App === undefined || usuario_App === null){
      this.utilsSVC.mostrarAlerta('Atención', 'No se pudo obtener el usuario logeado en la aplicación. Por favor, inicia sesión nuevamente.')
      hayError = true;
    }

    if (dia === '' || dia === undefined || dia === null || hora === '' || hora === undefined || hora === null){
      this.utilsSVC.mostrarAlerta('Atención', 'No se pudo obtener la fecha y/o la hora del turno. Por favor, inténtalo nuevamente.')
      hayError = true;
    }

    if (id_persona === '' || id_persona === undefined || id_persona === null || 
    name === '' || name === undefined || name === null || 
    apel === '' || apel === undefined || apel === null){
      this.utilsSVC.mostrarAlerta('Atención', 'No se pudo obtener el nombre y/o apellido de la persona a quien se le asigna el turno. Por favor, inténtalo nuevamente.')
      hayError = true;
    }

    //se agrega el turno
    if (hayError === false){
      this.agregarTurno(dia, hora, id_persona, usuario_App, name, apel)
    }
  }

  private async agregarTurno(fecha: string, hora:string, IDpersona:string, IDusuario:string, nombre:string, apellido:string) {
    try {
      if (IDpersona !== '' && IDusuario !== '') {

        const app = initializeApp(environment.firebaseConfig);
        const db = getFirestore(app);        
        const docu_name: string = this.utilsSVC.generaCadenaAleatoria(20);
        //console.log(fecha, hora, IDpersona, IDusuario, nombre, apellido, docu_name)
        // agrega un nuevo documento a la coleccion turnos
        await setDoc(doc(db, "turnos", docu_name), {
          fecha: fecha,
          hora: hora,
          nom_paciente: nombre + ' ' + apellido,
          pacienteID: IDpersona,
          usuarioID: IDusuario
        });

        //--------------------------------------------------------------------------
        // se envía una notificacion al cliente
        if ((environment.emailSettings.sendEmail) === true) {
          this.emailData = {
            remitente: sessionStorage.getItem('nombreUsuario') + " " + sessionStorage.getItem('apellidoUsuario'),
            emailFrom: environment.emailSettings.emailAccount,
            asunto: "Notificación de asignación de turno",
            mensaje: "Hola " + this.persona.nombre + " " + this.persona.apellido + "\n" + 
            sessionStorage.getItem('nombreUsuario') + " " + 
            sessionStorage.getItem('apellidoUsuario') + 
            " te ha asignado un turno el día " + fecha + " a las " + hora + " horas." + 
            "\n\nTe esperamos.",
            emailTo: this.persona.correo,
            prioridad: "high",
            replyTo: this.userSVC.getUsuarioActualApp().toString()
          }
          this.mensajeSVC.sendMessage(this.emailData).subscribe(() => {
            //console.log("Email enviado al cliente");
          });
        }
        //--------------------------------------------------------------------------    

        //console.log('Se agregó un turno a la BBDD');
        this.utilsSVC.mostrarAlerta('Aviso', 'Se ha agendado un nuevo turno.');   
      } else {
        this.utilsSVC.mostrarAlerta('Atención', 'No se pudo agregar el turno porque faltaba información importante.');
      }
    } catch (error: any) {
      //console.log('Se generó un problema al agregar un turno. Error:' + error);
      this.utilsSVC.mostrarAlerta('Atención', 'Se generó un problema al agregar el turno a la base de datos.');
    } finally{
      //this.router.navigate(['agenda/' + this.fechaSel]);
      this.router.navigateByUrl('/agenda/' + this.fechaSel);
    }
  }

  SeleccionPersona_Change(evento:any){
    for (let i=0; i<this.personas.length; i++){
      if(this.personas[i].id === evento.detail.value){
        this.persona=this.personas[i];
      }
    }
  }

  cambioFecha(evento:any){
    this.horaSel=this.utilsSVC.getHoraFromISO(evento.detail.value);   
    //console.log(this.horaSel)
  }
  
}
