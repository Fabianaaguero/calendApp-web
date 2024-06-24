import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PatientsPageRoutingModule } from './patients-routing.module';
import { PatientInfoPage } from './patient-info.page';
import { PatientsPage } from './patients.page';
import { FilterPipe } from './filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatientsPageRoutingModule
  ],
  declarations: [PatientsPage, FilterPipe, PatientInfoPage],
  entryComponents: [
    PatientInfoPage
  ],
  providers: [FilterPipe]
})
export class PatientsPageModule {}
