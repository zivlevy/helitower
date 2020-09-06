import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallSignPage } from './call-sign.page';

const routes: Routes = [
  {
    path: '',
    component: CallSignPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallSignPageRoutingModule {}
