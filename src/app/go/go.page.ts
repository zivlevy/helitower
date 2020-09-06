import { Component, OnInit } from '@angular/core';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-go',
  templateUrl: './go.page.html',
  styleUrls: ['./go.page.scss'],
})
export class GoPage implements OnInit {
  type = 'helicopter';
  callSign = 'דילר 1';
  constructor() { }

  ngOnInit() {
  }



}
