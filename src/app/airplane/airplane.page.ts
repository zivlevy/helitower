import {Component, OnInit} from '@angular/core';
import {NavController} from '@ionic/angular';
import {StateService} from '../services/state.service';
import {AircraftTypes} from '../model/state';

@Component({
  selector: 'app-airplane',
  templateUrl: './airplane.page.html',
  styleUrls: ['./airplane.page.scss'],
})
export class AirplanePage implements OnInit {

  constructor(public navCtrl: NavController,
              private stateService: StateService) { }

  ngOnInit() {

  }

  gotoCallSign(type){
    if (type === 'airplane') {
      this.stateService.setAircraftType(AircraftTypes.airplane);
    } else {
      this.stateService.setAircraftType(AircraftTypes.helicopter);
    }

    this.navCtrl.navigateForward('call-sign', {animated: true});
  }

}
