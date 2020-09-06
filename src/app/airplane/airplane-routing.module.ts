import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirplanePage } from './airplane.page';

const routes: Routes = [
  {
    path: '',
    component: AirplanePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AirplanePageRoutingModule {}
