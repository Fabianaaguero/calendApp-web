import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepatientPageRoutingModule } from './createpatient-routing.module';

import { CreatepatientPage } from './createpatient.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepatientPageRoutingModule
  ],
  declarations: [CreatepatientPage]
})
export class CreatepatientPageModule {}
