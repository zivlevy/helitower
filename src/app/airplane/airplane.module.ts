import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AirplanePageRoutingModule } from './airplane-routing.module';

import { AirplanePage } from './airplane.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AirplanePageRoutingModule
  ],
  declarations: [AirplanePage]
})
export class AirplanePageModule {}
