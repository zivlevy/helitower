import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OperatingPageRoutingModule } from './operating-routing.module';

import { OperatingPage } from './operating.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OperatingPageRoutingModule
  ],
  declarations: [OperatingPage]
})
export class OperatingPageModule {}
