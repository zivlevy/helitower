import {Component, OnInit, ViewChild} from '@angular/core';
import {IonInput, NavController} from '@ionic/angular';

@Component({
  selector: 'app-call-sign',
  templateUrl: './call-sign.page.html',
  styleUrls: ['./call-sign.page.scss'],
})
export class CallSignPage implements OnInit {
  @ViewChild('myInput', { static: false }) callsign: IonInput;
  constructor(public navCtrl: NavController) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    setTimeout(() => this.callsign.setFocus(), 300);
  }

  next() {
    this.navCtrl.navigateForward('go');
  }

}
