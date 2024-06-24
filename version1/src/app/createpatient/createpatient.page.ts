import { Component, OnInit } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, getFirestore, deleteDoc } from '@angular/fire/firestore';
import { UsuarioService } from '../services/usuario.service';
import { UtilsService } from '../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-createpatient',
  templateUrl: './createpatient.page.html',
  styleUrls: ['./createpatient.page.scss'],
})

export class CreatepatientPage implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private userSVC: UsuarioService,
    private utilsSVC: UtilsService
  ) { }

  ngOnInit() {
    this.limpiarCampos();
  }

  collection: any[] | undefined;

  inputNombre: string = '';
  inputApellido: string = '';
  inputDNI: string = '';
  inputFechaNac: string = '';
  inputCorreo: string = '';
  inputTelefono: string = '';

  limpiarCampos() {
    this.inputNombre = '';
    this.inputApellido = '';
    this.inputDNI = '';
    this.inputFechaNac = '';
    this.inputCorreo = '';
    this.inputTelefono = '';
  }

  nuevoCliente() {
    let hayError: Boolean = false;

    if (
      this.inputNombre.trim() === '' ||
      this.inputApellido.trim() === '' ||
      this.inputDNI.trim() === '' ||
      this.inputFechaNac.trim() === '' ||
      this.inputCorreo.trim() === '' ||
      this.inputTelefono.trim() === ''
    ) {
      this.utilsSVC.mostrarAlerta('Advertencia', 'Por favor completa todos los campos');
      hayError = true;
    } else {
      if (isNaN(Number(this.inputDNI))) {
        this.utilsSVC.mostrarAlerta('Advertencia', 'El campo DNI debe ser un número');
        hayError = true;
      } else {
        if (this.inputDNI.length < 7 || this.inputDNI.length > 8) {
          this.utilsSVC.mostrarAlerta('Advertencia', 'El DNI debe tener entre 7 y 8 números');
          hayError = true;
        }
      }

      if (!this.inputCorreo.includes('@')) {
        this.utilsSVC.mostrarAlerta('Advertencia', 'El campo Correo electrónico debe ser válido');
        hayError = true;
      }

      if (isNaN(Number(this.inputTelefono))) {
        this.utilsSVC.mostrarAlerta('Advertencia', 'El campo Teléfono debe ser un número');
        hayError = true;
      }
    }

    if (hayError === false) {
      this.agregarCliente();
    };
  };


  private agregarCliente(){
    const objetoAgregar: any = {
      nombre: this.inputNombre,
      apellido: this.inputApellido,
      dni: this.inputDNI,
      fechaNac: this.inputFechaNac,
      correo: this.inputCorreo,
      telefono: this.inputTelefono,
      usuarioID: this.userSVC.getUsuarioActualApp()
    };

    const collectionCrear = collection(this.firestore, 'pacientes');
    addDoc(collectionCrear, objetoAgregar)
      .then(() => {
        //console.log('Se ha agregado el paciente');
        this.utilsSVC.mostrarAlerta('Aviso', 'Se ha agregado el cliente correctamente');
        this.limpiarCampos();
        this.router.navigate(['/patients']);
      })
      .catch((err) => {
        //console.error('Error al agregar el paciente:', err);
        this.limpiarCampos();
        this.utilsSVC.mostrarAlerta('Atención', 'Se produjo un error al agregar el cliente \n Por favor inténtelo nuevamente.');
      });
  }

  protected cancelar() {
    this.limpiarCampos();
    this.router.navigateByUrl('/home');
  }
}
