import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Assignturn2PageRoutingModule } from './assignturn2-routing.module';

import { Assignturn2Page } from './assignturn2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Assignturn2PageRoutingModule
  ],
  declarations: [Assignturn2Page]
})
export class Assignturn2PageModule {}
