import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly notifier: NotifierService;

  constructor(notifierService: NotifierService) {  this.notifier = notifierService; }

  ngOnInit() {
   

  }

  alertShow(){
    this.notifier.notify( 'success', 'You are awesome! I mean it!' );
  }

}
