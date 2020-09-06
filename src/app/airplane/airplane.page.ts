import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-airplane',
  templateUrl: './airplane.page.html',
  styleUrls: ['./airplane.page.scss'],
})
export class AirplanePage implements OnInit {

  constructor(public navCtrl: NavController) { }

  ngOnInit() {

  }

  gotoCallSign(type){
    this.navCtrl.navigateForward('call-sign', {animated: true});
  }

}
