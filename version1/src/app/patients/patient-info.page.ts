import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.page.html',
  styleUrls: ['./patient-info.page.scss'],
})
export class PatientInfoPage {
  @Input() paciente: any;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
   

  cerrar(){
    this.modalController.dismiss();
  }
}
