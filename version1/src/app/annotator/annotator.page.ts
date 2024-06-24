import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, collection, addDoc, collectionData, doc, getDoc, getFirestore, deleteDoc, updateDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-annotator',
  templateUrl: './annotator.page.html',
  styleUrls: ['./annotator.page.scss'],
})
export class AnnotatorPage implements OnInit {
  pacienteSeleccionado: any;
  observaciones: string[] = [];
  anotadorInput: string;
  escriturasAnteriores: string[];
  notaSeleccionada: string | null = null;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
  ) 
    {
    this.anotadorInput = '';
    this.escriturasAnteriores = [];
  }


  async ngOnInit() {
    const pacienteId = this.route.snapshot.paramMap.get('pacienteId');
    if (pacienteId) {
      try {
        const db = getFirestore();
        const docRef = doc(db, 'pacientes', pacienteId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
          const datos = docSnapshot.data();
          this.pacienteSeleccionado = {
            id: docSnapshot.id,
            nombre: datos['nombre'],
            apellido: datos['apellido'],
            correo: datos['correo'],
            dni: datos['dni'],
            numero: datos['telefono'],
            edad: datos['edad'],
            anotador: datos['anotador']
          };
          this.escriturasAnteriores = datos['escrituras'] || [];
          this.observaciones = this.escriturasAnteriores.slice(); // Copiar las escrituras anteriores a las observaciones
        } else {
          console.log('No se encontró el cliente con el ID:', pacienteId);
          // Manejar el caso cuando no se encuentra el cliente en la base de datos
        }
      } catch (error) {
        console.log('Error al obtener los datos del cliente:', error);
        // Manejar el error al obtener los datos del cliente
      }
    } else {
      console.log('No se proporcionó el pacienteId');
      // Manejar el caso cuando no se proporciona el pacienteId
    }

    // Mostrar las anotaciones al cargar la página
    this.mostrarAnotaciones();
  }

  async mostrarAnotaciones() {
    try {
      const db = getFirestore();
      const escriturasRef = doc(db, 'pacientes', this.pacienteSeleccionado.id);
      const escriturasSnapshot = await getDoc(escriturasRef);

      if (escriturasSnapshot.exists()) {
        const datos = escriturasSnapshot.data();
        this.observaciones = datos['escrituras'] || [];
      } else {
        console.log('No se encontraron anotaciones para el cliente');
      }
    } catch (error) {
      console.log('Error al obtener las anotaciones:', error);
    }
  }

  async guardarEscritura() {
    const escritura = this.anotadorInput.trim();
    if (escritura) {
      try {
        const db = getFirestore();
        const escriturasRef = doc(db, 'pacientes', this.pacienteSeleccionado.id);
        await updateDoc(escriturasRef, {
          anotador: escritura,
          escrituras: [...this.escriturasAnteriores, escritura]
        });

        // Limpiar el input después de guardar
        this.anotadorInput = '';
        this.escriturasAnteriores.push(escritura);
        this.observaciones.push(escritura); // Agregar la nueva escritura a la lista de observaciones
      } catch (error) {
        console.log('Error al guardar la escritura:', error);
        // Manejar el error al guardar la escritura
      }
    }
  }


  async eliminarObservacion(observacion: string) {
    const index = this.observaciones.indexOf(observacion);
    if (index > -1) {
      this.observaciones.splice(index, 1); // Eliminar la observación de la lista

      try {
        const db = getFirestore();
        const escriturasRef = doc(db, 'pacientes', this.pacienteSeleccionado.id);
        await updateDoc(escriturasRef, {
          escrituras: this.observaciones
        });
      } catch (error) {
        console.log('Error al eliminar la observación:', error);
        // Manejar el error al eliminar la observación
      }
    }
  }
  async abrirNota(nota: string) {
    this.notaSeleccionada = nota;
  }

  cerrarNota() {
    this.notaSeleccionada = null;
  }
  guardarObservaciones() {
    this.pacienteSeleccionado.anotador = this.observaciones;
    console.log(this.pacienteSeleccionado.anotador);
    console.log('Observaciones guardadas:', this.observaciones);
  }

  cancelarAnotador() {
    this.router.navigate(['/patients']);
  }
}