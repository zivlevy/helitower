import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GoPageRoutingModule } from './go-routing.module';

import { GoPage } from './go.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GoPageRoutingModule
  ],
  declarations: [GoPage]
})
export class GoPageModule {}
