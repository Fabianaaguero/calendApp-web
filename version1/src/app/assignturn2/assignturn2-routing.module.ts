import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Assignturn2Page } from './assignturn2.page';

const routes: Routes = [
  {
    path: '',
    component: Assignturn2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Assignturn2PageRoutingModule {}
