export interface ZLocation {
    lat: number;
    lng: number;
    isGood: boolean;
    ts: number;
    speed: number;
    heading: number;
    altitude: number;

}

export interface LocationItem {
    lat: number;
    lng: number;
    timestamp: number;
    alt: number;
    speed: number;
    heading: number;
    uid: string;
    callsign: string;
    type: 'ac' | 'hl';
}
