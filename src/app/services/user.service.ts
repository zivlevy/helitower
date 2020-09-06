import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    user = null;
    currentUser$: BehaviorSubject<any | null> = new BehaviorSubject<any>(null);

    constructor(private afAuth: AngularFireAuth) {
        this.afAuth.signInAnonymously()
            .then(res => {
                this.user = res.user;
                console.log('=============================');
                console.log(this.user);
                console.log('=============================');
                this.currentUser$.next(this.user);
            });
    }

    getCurentUser$() {
        return this.currentUser$.asObservable();
    }
}
