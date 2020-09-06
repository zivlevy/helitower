import {Injectable} from '@angular/core';
import {AircraftTypes} from '../model/state';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  callSign$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  aircraftType$: BehaviorSubject<AircraftTypes> = new BehaviorSubject<AircraftTypes>(AircraftTypes.none);
  constructor() { }

  setCallSign( callSign: string) {
    this.callSign$.next(callSign);
  }
  getCallSign$() {
    return this.callSign$.asObservable();
  }

  setAircraftType(aircraftType: AircraftTypes) {
    this.aircraftType$.next(aircraftType);
  }

  getAircraftType$() {
    return this.aircraftType$.asObservable();

  }




}
