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
            }, (err) => {
                console.log('========------- error ======-----');
            }, () => {
                console.log('========------- COMPLETED ======-----');
            });

            this.isConnected$.next(this.network.type !== 'none');
            this.network.onConnect().subscribe(() => {
                console.log('reconnect');
                this.isConnected$.next(true);
            }, (err) => {
                console.log('========------- error ======-----');
            }, () => {
                console.log('========------- COMPLETED ======-----');
            });
        });
    }

    // get current network connection
    getIsConnected$() {
        return this.isConnected$.asObservable();
    }
}
