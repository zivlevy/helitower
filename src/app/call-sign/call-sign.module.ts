import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallSignPageRoutingModule } from './call-sign-routing.module';

import { CallSignPage } from './call-sign.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallSignPageRoutingModule
  ],
  declarations: [CallSignPage]
})
export class CallSignPageModule {}
