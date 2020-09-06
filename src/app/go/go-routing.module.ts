import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GoPage } from './go.page';

const routes: Routes = [
  {
    path: '',
    component: GoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoPageRoutingModule {}
