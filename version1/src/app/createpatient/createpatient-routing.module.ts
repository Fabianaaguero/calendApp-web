import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatepatientPage } from './createpatient.page';

const routes: Routes = [
  {
    path: '',
    component: CreatepatientPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreatepatientPageRoutingModule {}
