import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {IonInput, NavController} from '@ionic/angular';
import {StateService} from '../services/state.service';
import {Subject} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

@Component({
  selector: 'app-call-sign',
  templateUrl: './call-sign.page.html',
  styleUrls: ['./call-sign.page.scss'],
})
export class CallSignPage implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myInput', { static: false }) callsignInput: IonInput;
  callSign = '';
  constructor(public navCtrl: NavController,
              private stateService: StateService) { }

  ngOnInit() {
    this.stateService.getCallSign$()
        .pipe(takeUntil(this.destroy$))
        .subscribe(callSign => {
          this.callSign = callSign;
        });
  }

  ionViewWillEnter() {
    setTimeout(() => this.callsignInput.setFocus(), 300);
  }

  next() {
    this.stateService.setCallSign(this.callsignInput.value.toString());
    this.navCtrl.navigateForward('go');
  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
