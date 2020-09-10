import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {NetworkService} from './services/network.service';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private networkService: NetworkService,
        private backgroundMode: BackgroundMode,
        private screenOrientation: ScreenOrientation,
        private locationAccuracy: LocationAccuracy
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
            if (this.platform.is('android')) {
                this.backgroundMode.enable();
                this.backgroundMode.on('activate').subscribe(() => {
                    this.backgroundMode.disableWebViewOptimizations();
                    this.backgroundMode.disableBatteryOptimizations();
                    // this.backgroundMode.moveToForeground();
                });
            }
            this.statusBar.styleDefault();
            this.splashScreen.hide();

            this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => console.log('Request successful'),
                        error => console.log('Error requesting location permissions', error)
                    );
                }
            });

        });
    }
}
