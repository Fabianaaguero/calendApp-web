import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnotatorPage } from './annotator.page';

const routes: Routes = [
  {
    path: '',
    component: AnnotatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnnotatorPageRoutingModule {}
