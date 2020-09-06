import {Injectable} from '@angular/core';
import {Network} from '@ionic-native/network/ngx';
import {Platform} from '@ionic/angular';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserService} from './user.service';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    user: any;
    connectedRef: any;
    disconnectedRef: any;
    isConnected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    constructor(private network: Network,
                private platform: Platform,
                private userService: UserService,
                private afs: AngularFirestore) {


        this.platform.ready().then(() => {
            this.network.onDisconnect().subscribe(() => {
                console.log('disconnect');
                this.isConnected$.next(false);
                this.saveNewNetworkStatus(false);
            }, (err) => {
                console.log('========------- error ======-----');
            }, () => {
                console.log('========------- COMPLETED ======-----');
            });

            this.isConnected$.next(this.network.type !== 'none');
            this.network.onConnect().subscribe(() => {
                console.log('reconnect');
                this.isConnected$.next(true);
                this.saveNewNetworkStatus(true);
            }, (err) => {
                console.log('========------- error ======-----');
            }, () => {
                console.log('========------- COMPLETED ======-----');
            });

            this.userService.getCurentUser$()
                .pipe()
                .subscribe(user => {
                    this.user = user;
                    if (user) {
                        console.log('network service!');
                        console.log(this.network.type);
                        if (this.network.type === 'none') {
                            this.saveNewNetworkStatus(false);
                        } else {
                            this.saveNewNetworkStatus(true);
                        }
                        console.log(user);
                    }

                });


        });
    }

    // Save a new location to Firebase
    saveNewNetworkStatus(status: boolean) {
        console.log('============ connection changed =======');
        console.log(status);
        console.log(this.user);
        if (!this.user) {
            return;
        }
        this.afs.collection(`network/${this.user.uid}/track`, ref => ref.orderBy('ts')).add({connected: status, ts: Date.now()})
            .then()
            .catch(err => console.log(err));
    }

    // get current network connection
    getIsConnected$() {
        return this.isConnected$.asObservable();
    }
}
