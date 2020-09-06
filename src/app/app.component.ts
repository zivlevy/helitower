import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {NetworkService} from './services/network.service';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';

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
    private backgroundMode: BackgroundMode
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.backgroundMode.enable();
        this.backgroundMode.on('activate').subscribe(() => {
          this.backgroundMode.disableWebViewOptimizations();
          this.backgroundMode.disableBatteryOptimizations();
          this.backgroundMode.moveToForeground();
        });
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
