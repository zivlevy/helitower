import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';
import {Network} from '@ionic-native/network/ngx';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import {ScreenOrientation} from '@ionic-native/screen-orientation/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot({mode: 'ios'}),
        AppRoutingModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule

    ],
    providers: [
        StatusBar,
        SplashScreen,
        BackgroundGeolocation,
        Network,
        BackgroundMode,
        ScreenOrientation,
        LocationAccuracy,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
