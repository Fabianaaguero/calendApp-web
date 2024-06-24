import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateturnoPage } from './createturno.page';

const routes: Routes = [
  {
    path: '',
    component: CreateturnoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateturnoPageRoutingModule {}
