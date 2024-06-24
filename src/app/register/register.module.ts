import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { registerPageRoutingModule } from './register-routing.module';

import { registerPage } from './register.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    registerPageRoutingModule
  ],
  declarations: [registerPage]
})
export class registerPageModule {}
