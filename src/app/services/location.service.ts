import {EventEmitter, Injectable, NgZone} from '@angular/core';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationEvents, BackgroundGeolocationLocationProvider,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import {Platform} from '@ionic/angular';
import {BehaviorSubject} from 'rxjs';
import {ZLocation} from '../model/location.model';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {constants} from '../model/constants';
import {BackgroundGeolocationAccuracy} from '@ionic-native/background-geolocation';
import {NetworkService} from './network.service';

declare type GeoLocationServiceState = 'disabled' | 'searching' | 'tracking';

export interface LatLngAlt {
    lat: number;
    lng: number;
    alt?: number;
}

export interface ILatLngTime extends LatLngAlt {
    timestamp: Date;
}

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private state: GeoLocationServiceState;
    private watchNumber: number;
    private isBackground: boolean;
    private wasInitialized: boolean;

    public positionChanged: EventEmitter<Position>;
    public bulkPositionChanged: EventEmitter<Position[]>;
    public currentLocation: ILatLngTime;

    currentPosition$: BehaviorSubject<ZLocation> = new BehaviorSubject({
        lat: 0,
        lng: 0,
        isGood: false,
        ts: 0,
        speed: 0,
        heading: 0,
        altitude: 0
    });
    locationSend$: BehaviorSubject<any> = new BehaviorSubject(null);

    locationsCollection: AngularFirestoreCollection<any>;
    user: any;
    isConnected = false;

    constructor(private backgroundGeolocation: BackgroundGeolocation,
                private platform: Platform,
                private userService: UserService,
                private afs: AngularFirestore,
                private readonly ngZone: NgZone,
                private networkService: NetworkService) {

        this.watchNumber = -1;
        this.positionChanged = new EventEmitter<Position>();
        this.bulkPositionChanged = new EventEmitter<Position[]>();
        this.state = 'disabled';
        this.isBackground = false;
        this.currentLocation = null;
        this.wasInitialized = false;

        this.userService.getCurentUser$()
            .pipe()
            .subscribe(user => {
                this.user = user;
                if (user) {
                    console.log(user);
                }

            });

        this.platform.ready().then(() => {
            this.networkService.getIsConnected$()
                .subscribe(isConnected => this.isConnected = isConnected);
            this.enable();

        });
    }

    // Save a new location to Firebase
    saveNewLocation(loc: Position) {
        if (!this.user || !this.isConnected) {
            // window.alert('not saving');
            return;
        }
        this.locationsCollection = this.afs.collection(
            `locations/${this.user.uid}/track`,
            ref => ref.orderBy('timestamp')
        );
        this.afs.doc(`locations/${this.user.uid}`).set({
            lat: loc.coords.latitude,
            lng: loc.coords.longitude,
            timestamp: loc.timestamp,
            alt: loc.coords.altitude,
            speed: loc.coords.speed,
            heading: loc.coords.heading,
        }, {merge: true}).then(() => {
            this.locationSend$.next({msg: 'good', date: Date.now()});
        }).catch(err => {
            this.locationSend$.next({msg: 'bad', date: Date.now()});
        });
        // this.afs.collection(`locations/${this.user.uid}/track`, ref => ref.orderBy('ts')).add({
        //     lat: loc.lat,
        //     lng: loc.lng,
        //     timestamp: loc.ts,
        //     alt: loc.altitude,
        //     speed: loc.speed,
        //     heading: loc.heading,
        // })
        //     .then()
        //     .catch(err => console.log(err));
    }

    getCurrentLocation$() {
        return this.currentPosition$.asObservable();
    }

    getLocationSend$() {
        return this.locationSend$.asObservable();
    }

    //

    public getState(): GeoLocationServiceState {
        return this.state;
    }

    public enable() {
        switch (this.state) {
            case 'disabled':
                this.startWatching();
                return;
            case 'searching':
            case 'tracking':
                return;

        }
    }

    public async disable() {
        switch (this.state) {
            case 'disabled':
                return;
            case 'searching':
            case 'tracking':
                await this.stopWatching();
                return;
        }
    }

    public canRecord(): boolean {
        return this.state === 'tracking' && this.currentLocation != null;
    }

    private startWatching() {
        this.state = 'searching';
        this.startBackgroundGeolocation();
    }

    private startBackgroundGeolocation() {
        if (this.wasInitialized) {
            this.backgroundGeolocation.start();
            return;
        }
        this.wasInitialized = true;
        this.backgroundGeolocation.configure({
            locationProvider: BackgroundGeolocationLocationProvider.RAW_PROVIDER,
            desiredAccuracy: 0, // BackgroundGeolocationAccuracy.HIGH,
            stationaryRadius: 0,
            distanceFilter: 0,
            notificationTitle: 'Helimap tracking',
            notificationText: 'runningInBackground',
            interval: 1000,
            fastestInterval: 1000,
            activitiesInterval: 10000,
            startForeground: true
        });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(async (_: BackgroundGeolocationResponse) => {
            // if (this.isBackground) {
            //     return;
            // }
            const locations = await this.backgroundGeolocation.getValidLocations() as BackgroundGeolocationResponse[];
            this.backgroundGeolocation.deleteAllLocations();
            const positions = locations.map(l => this.locationToPosition(l));
            if (positions.length === 0) {
                console.log(`[GeoLocation] There's nothing to send - valid locations array is empty`);
            } else if (positions.length === 1) {
                console.log(`[GeoLocation] Sending a location update`);
                this.handlePoistionChange(positions[positions.length - 1]);
            } else {
                console.log(`[GeoLocation] Sending bulk location update on each location update: ${positions.length}`);
                this.bulkPositionChanged.next(positions.splice(0, positions.length - 1));
                this.handlePoistionChange(positions[0]);
            }
        });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.start).subscribe(
            () => {
                console.log('[GeoLocation] Start service');
            });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.stop).subscribe(
            () => {
                console.log('[GeoLocation] Stop service');
            });

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.background).subscribe(
            // async () => {
            //     this.isBackground = true;
            //     console.log('[GeoLocation] Now in background');
            //     const locations = await this.backgroundGeolocation.getValidLocations() as BackgroundGeolocationResponse[];
            //     this.backgroundGeolocation.deleteAllLocations();
            //     const positions = locations.map(l => this.locationToPosition(l));
            //     if (positions.length > 0) {
            //         console.log(`[GeoLocation] Sending bulk location update: ${positions.length}`);
            //         this.currentLocation = this.positionToLatLngTime(positions[positions.length - 1]);
            //         this.bulkPositionChanged.next(positions);
            //     }
            // });
        );

        this.backgroundGeolocation.on(BackgroundGeolocationEvents.foreground).subscribe(
            // async () => {
            //     console.log('[GeoLocation] Now in foreground');
            //     const locations = await this.backgroundGeolocation.getValidLocations() as BackgroundGeolocationResponse[];
            //     this.backgroundGeolocation.deleteAllLocations();
            //     this.isBackground = false;
            //     const positions = locations.map(l => this.locationToPosition(l));
            //     if (positions.length > 0) {
            //         console.log(`[GeoLocation] Sending bulk location update: ${positions.length}`);
            //         this.currentLocation = this.positionToLatLngTime(positions[positions.length - 1]);
            //         this.bulkPositionChanged.next(positions);
            //     }
            // });
        );
        this.backgroundGeolocation.start();
    }

    private async stopWatching() {
        this.state = 'disabled';
        this.currentLocation = null;
        this.positionChanged.next(null);
        console.log('[GeoLocation] Stopping background tracking');
        await this.backgroundGeolocation.stop();

    }

    private handlePoistionChange(position: Position): void {
        this.ngZone.run(() => {
            console.log('[GeoLocation] Received position: ' + JSON.stringify(this.positionToLatLngTime(position)));
            if (this.state === 'searching') {
                this.state = 'tracking';
            }
            if (this.state !== 'tracking') {
                return;
            }
            this.currentLocation = this.positionToLatLngTime(position);
            this.positionChanged.next(position);

            this.saveNewLocation(position);

        });
    }

    public positionToLatLngTime(position: Position): ILatLngTime {
        return {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            alt: position.coords.altitude,
            timestamp: new Date(position.timestamp)
        };
    }

    private locationToPosition(location: BackgroundGeolocationResponse): Position {
        return {
            coords: {
                accuracy: location.accuracy,
                altitude: location.altitude * constants.FEET_PER_METER,
                latitude: location.latitude,
                longitude: location.longitude,
                speed: location.speed * 3.6,
                heading: location.bearing
            },
            timestamp: location.time
        } as Position;
    }

}
