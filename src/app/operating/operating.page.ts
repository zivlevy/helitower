import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {NavController} from '@ionic/angular';
import {LocationService} from '../services/location.service';
import {NetworkService} from '../services/network.service';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-operating',
  templateUrl: './operating.page.html',
  styleUrls: ['./operating.page.scss'],
})
export class OperatingPage implements OnInit , OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  loc: any = null;
  sendStatus: any = null;
  isConnected = false;
  constructor(public navCtrl: NavController,
              private locationService: LocationService,
              private networkService: NetworkService) {
    locationService.positionChanged
        .subscribe(loc => {
          this.loc = loc;
        });

    locationService.getLocationSend$()
        .pipe(takeUntil(this.destroy$))
        .subscribe(sendStatus => {
          this.sendStatus = sendStatus;
        });

    networkService.getIsConnected$()
        .pipe(takeUntil(this.destroy$))
        .subscribe(isConnected => {
          this.isConnected = isConnected;
        });
  }

  ngOnInit() {
  }

  stop() {
    this.navCtrl.navigateRoot('airplane')

  }

  ngOnDestroy() {
    // force unsubscribe
    console.log('stop destroied')
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
