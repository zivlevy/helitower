import {Component, OnDestroy, OnInit} from '@angular/core';
import {takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {StateService} from '../services/state.service';
import {AircraftTypes} from '../model/state';
import {NavController} from '@ionic/angular';
import {LocationService} from '../services/location.service';

@Component({
    selector: 'app-go',
    templateUrl: './go.page.html',
    styleUrls: ['./go.page.scss'],
})
export class GoPage implements OnInit, OnDestroy {
    destroy$: Subject<boolean> = new Subject<boolean>();
    type = 'helicopter';
    callSign = 'דילר 1';

    constructor(private stateService: StateService,
                private navCtrl: NavController,
                private locationService: LocationService
) {
    }

    ngOnInit() {
        this.stateService.getCallSign$()
            .pipe(takeUntil(this.destroy$))
            .subscribe(callSign => {
                console.log(callSign);
                this.callSign = callSign;
            });

        this.stateService.getAircraftType$()
            .pipe(takeUntil(this.destroy$))
            .subscribe(type => {
                if (type === AircraftTypes.helicopter) {
                    this.type = 'helicopter';
                } else if (type === AircraftTypes.airplane) {
                    this.type = 'airplane';
                } else {
                    this.type = '';
                }
            });
    }
    operate() {
        this.navCtrl.navigateRoot(`operating`, {animated: true });
        this.locationService.startLocation();
    }
    ngOnDestroy() {
        // force unsubscribe
        this.destroy$.next(true);
        // Now let's also unsubscribe from the subject itself:
        this.destroy$.unsubscribe();
    }

}
