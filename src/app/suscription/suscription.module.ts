import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuscriptionPageRoutingModule } from './suscription-routing.module';

import { SuscriptionPage } from './suscription.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuscriptionPageRoutingModule
  ],
  declarations: [SuscriptionPage]
})
export class SuscriptionPageModule {}
