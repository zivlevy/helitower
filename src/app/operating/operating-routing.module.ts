import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OperatingPage } from './operating.page';

const routes: Routes = [
  {
    path: '',
    component: OperatingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperatingPageRoutingModule {}
