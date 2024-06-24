import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AnnotatorPageRoutingModule } from './annotator-routing.module';

import { AnnotatorPage } from './annotator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnnotatorPageRoutingModule
  ],
  declarations: [AnnotatorPage]
})
export class AnnotatorPageModule {}
