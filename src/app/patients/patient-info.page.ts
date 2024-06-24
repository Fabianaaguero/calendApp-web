import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
// import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-patient-info',
  templateUrl: './patient-info.page.html',
  styleUrls: ['./patient-info.page.scss'],
})
export class PatientInfoPage {
  @Input() paciente: any;
  // public mobile:boolean=true;

  constructor(
    private modalController: ModalController,
    private router: Router,
    private route: ActivatedRoute,
    // private platform: Platform
  ) {
    // platform.ready().then(() => {

    //   if (this.platform.is('android') || this.platform.is('ios')) {
    //     console.log("running on Android or iOS device!");
    //     this.mobile=true;
    //   } else {
    //       this.mobile=false;
    //   }
    // });
  }

  cerrar() {
    this.modalController.dismiss();
  }
}
