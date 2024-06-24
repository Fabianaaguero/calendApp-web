import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { registerPage } from './register.page';

const routes: Routes = [
  {
    path: '',
    component: registerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class registerPageRoutingModule {}
