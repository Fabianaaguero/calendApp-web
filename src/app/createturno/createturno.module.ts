import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateturnoPageRoutingModule } from './createturno-routing.module';

import { CreateturnoPage } from './createturno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateturnoPageRoutingModule
  ],
  declarations: [CreateturnoPage]
})
export class CreateturnoPageModule {}
